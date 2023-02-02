import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CircularProgress,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Link,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  flatten,
  get,
  keys,
  keysIn,
  lowerCase,
  pick,
  pickBy,
  trim,
  truncate,
} from "lodash";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { titleCase, useAuthUser } from "../../lib/utility";
import Editor from "../others/editor";
import { showNewPostDialog_ } from "../../lib/recoil";
import CloseIcon from "@mui/icons-material/Close";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Radio } from "@mui/material";
import useSWRImmutable from "swr/immutable";
import ArticleRender from "../others/articlerender";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import GradingIcon from "@mui/icons-material/Grading";
import { useTheme } from "@mui/material/styles";
import tagsArray from "../../lib/tags";

const tagTitles = tagsArray.map((tag) => tag.item);
console.log("tagTitles", tagTitles);

const tagsObj = tagTitles.reduce((acc, key) => {
  acc[key] = [];
  return acc;
}, {});

//console.log("tagsObj", tagsObj);

export default function NewPostEditor() {
  const [showNewPostDialog, setShowNewPostDialog] =
    useRecoilState(showNewPostDialog_);
  const [tab, setTab] = React.useState("1");

  const { user: userExist } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const { user, isLoading: loading } = useAuthUser(userExist);
  const schema = Yup.object().shape({
    title: Yup.string()
      .required("Please enter the title")
      .min(50, "Title is too short")
      .trim("")
      .lowercase(""),
    /* content: Yup.string()
      .min(20, "Comment is too short")
      .when("post_type", {
        is: "post",
        then: Yup.string().required("Content is required"),
      }), */
    /*   countries: Yup.array().transform((value, originalValue) => {
        return originalValue.map((item) => item.name);
      }),
      otherTags: Yup.array().transform((value, originalValue) =>
        keysIn(pickBy(originalValue, (val, key) => val === true))
      ), */
  });

  const router = useRouter();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const defaultValues = {};

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    unregister,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      activePanel: "panel1",
      ...tagsObj,
    },
  });

  const [tagsDialog, setTagsDialog] = useState(false);

  const getAiContent = async (key) => {
    try {
      const prompt = `edit using better English grammar and remove offensive words from the HTML content below, and the response should be an HTML document:${key}`;
      const max_tokens = 1000;
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      const model = "text-davinci-003";
      const temperature = 1;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const data = {
        prompt,
        model,
        max_tokens,
        temperature,
      };

      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        data,
        { headers }
      );

      console.log("response", response.data);

      const content = get(response, "data.choices[0].text", "");

      return content;
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAiTitle = async (key) => {
    try {
      const prompt = `in less than 100 characters, what is the title of this blog post ? :${key}`;
      const max_tokens = 1000;
      const apiKey = process.env.OPENAI_API_KEY;
      const model = "text-davinci-003";
      const temperature = 1;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const data = {
        prompt,
        model,
        max_tokens,
        temperature,
      };

      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        data,
        { headers }
      );

      console.log(
        "response",
        response.data,
        get(response, "data.choices[0].text", "")
      );

      const title = trim(get(response, "data.choices[0].text", ""), `"\n`);

      return title;
    } catch (error) {
      console.log("error", error);
    }
  };

  const {
    data: aicontent,
    mutate: mutateAiContent,
    isLoading: isLoadingAiContent,
    isValidating: isValidatingAiContent,
  } = useSWRImmutable(
    tab === "2" && watch("content").length > 50 ? watch("content") : undefined,
    getAiContent
  );

  const {
    data: aititle,
    mutate: mutateAiTitle,
    isLoading: isLoadingAiTitle,
    isValidating: isValidatingAiTitle,
  } = useSWRImmutable(
    tab === "2" && watch("content").length > 50
      ? `${watch("content")}\n\n\n\n\n\n\n`
      : undefined,
    getAiTitle
  );

  // console.log("aititle", aititle);

  const onSubmit = async (data) => {
    console.log("data", data);
    const content = data.activePanel === "panel1" ? data.content : aicontent;
    const title = data.activePanel === "panel1" ? data.title : aititle;
    const tags = pick(data, tagTitles);
    const tagsArray = flatten(Object.values(tags));
    console.log("tagsArray", title, content, tagsArray);
    return;
    try {
      await axios.post("/api/others/createpost", {
        user_id: user._id,
        title,
        content: "",
      });
      router.reload();
    } catch (error) {
      console.log(error?.response?.data, error);
    }
  };

  console.log("errors", errors);

  //backgroundColor: "primary.main",

  //console.log("values", watch("content"), watch("title"));

  return (
    <Stack>
      <Stack
        sx={{ p: 2, "& .MuiTabs-scroller": { height: "40px" } }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
      >
        <Dialog
          sx={{
            "&.MuiModal-root.MuiDialog-root": { zIndex: 1410 },
          }}
          open={tagsDialog}
          fullScreen={fullScreen}
          keepMounted
          disablePortal
        >
          <Stack>
            <Alert severity="info">
              <AlertTitle>One Last step - Taging</AlertTitle>
              Tag your post with relevant keywords to make it easier for others
              to discover. Improves visibility & attracts a wider audience.
            </Alert>
            <Stack spacing={2} sx={{ p: 2 }}>
              {tagsArray.map((tag, index) => {
                return (
                  <Stack
                    key={index}
                    alignItems="center"
                    spacing={2}
                    direction="row"
                  >
                    <Typography
                      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                    >
                      {titleCase(tag.item || "")}
                    </Typography>
                    <Controller
                      // @ts-ignore
                      name={tag.item}
                      // @ts-ignore
                      defaultValue={[]}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <Autocomplete
                            multiple
                            slotProps={{ popper: { sx: { zIndex: 1410 } } }}
                            ChipProps={{
                              size: "small",
                              color: "primary",
                              variant: "outlined",
                            }}
                            // @ts-ignore
                            value={value}
                            onChange={(e, v, r) => {
                              onChange(v);
                            }}
                            // disablePortal
                            fullWidth
                            id="tags-standard"
                            options={tag.options}
                            getOptionLabel={(option) => option.title}
                            // defaultValue={[top100Films[13]]}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                placeholder={`Select ${titleCase(
                                  tag.item || ""
                                )}`}
                                InputProps={{
                                  ...params.InputProps,
                                  disableUnderline: true,
                                }}
                              />
                            )}
                          />
                        );
                      }}
                    />
                  </Stack>
                );
              })}
              <ButtonGroup
                fullWidth
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button onClick={() => setTagsDialog(false)}>Back</Button>
                <Button type="submit">Complete</Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </Dialog>
        <TabContext value={tab}>
          <TabList>
            <Tab
              icon={<EditIcon fontSize="small" />}
              iconPosition="start"
              sx={{ minHeight: 0 }}
              label="CREATE POST"
              value="1"
            />
            <Tab
              sx={{ minHeight: 0 }}
              icon={<GradingIcon fontSize="small" />}
              iconPosition="start"
              label="REVIEW POST"
              value="2"
            />
            <CloseIcon
              sx={{
                cursor: "pointer",
                position: "absolute",
                right: 0,
                mr: 1,
                top: 10,
              }}
              onClick={() => setShowNewPostDialog(false)}
            />
          </TabList>
          <TabPanel sx={{ p: 0 }} value="1">
            <Stack spacing={1}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => {
                  const { onChange, value, ...rest } = field;
                  return (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      size="small"
                      fullWidth
                      id="title"
                      placeholder="Post Title"
                      variant="outlined"
                      required
                      inputProps={{ maxLength: 100 }}
                      sx={{
                        [`& fieldset`]: {
                          borderRadius: 1,
                        },
                      }}
                    />
                  );
                }}
              />
              <Controller
                name="content"
                control={control}
                render={({ field }) => {
                  const { onChange, value, ...rest } = field;
                  return (
                    <Box
                      sx={{
                        border: errors?.content ? "1px solid" : "none",
                        borderColor: "error.main",
                      }}
                    >
                      <Editor onChange={onChange} value={value} />
                      <Typography color="error" variant="caption">
                        {get(errors, "post.message")}
                      </Typography>
                    </Box>
                  );
                }}
              />
            </Stack>
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="2">
            <Controller
              name="activePanel"
              control={control}
              render={({ field }) => {
                const { onChange, value, ...rest } = field;
                return (
                  <Stack spacing={1}>
                    <Accordion
                      expanded={value === "panel1"}
                      onChange={() => onChange("panel1")}
                      variant="outlined"
                      sx={{
                        borderColor:
                          value === "panel1" ? "primary.main" : "none",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <Radio size="small" checked={value === "panel1"} />
                        }
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{titleCase(watch("title"))}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ArticleRender content={watch("content")} />
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={value === "panel2"}
                      onChange={() => onChange("panel2")}
                      variant="outlined"
                      sx={{
                        borderColor:
                          value === "panel2" ? "primary.main" : "none",
                      }}
                    >
                      <AccordionSummary
                        sx={{ cursor: "default !important" }}
                        expandIcon={
                          <Radio size="small" checked={value === "panel2"} />
                        }
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                      >
                        <Stack alignItems="center" spacing={1} direction="row">
                          {isLoadingAiTitle || isValidatingAiTitle ? (
                            <CircularProgress size={16} color="primary" />
                          ) : (
                            <RefreshIcon
                              sx={{ cursor: "pointer" }}
                              color="primary"
                              fontSize="small"
                              onClick={() => mutateAiTitle("")}
                            />
                          )}
                          {aititle ? (
                            <Typography>{titleCase(aititle)}</Typography>
                          ) : (
                            <Skeleton sx={{ height: "40px" }}>
                              <Typography>
                                {titleCase(watch("title"))}
                              </Typography>
                            </Skeleton>
                          )}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1} direction="row">
                          {isLoadingAiContent || isValidatingAiContent ? (
                            <CircularProgress size={16} color="primary" />
                          ) : (
                            <RefreshIcon
                              sx={{ cursor: "pointer" }}
                              color="primary"
                              fontSize="small"
                              onClick={() => mutateAiContent("")}
                            />
                          )}

                          {aicontent ? (
                            <ArticleRender content={aicontent} />
                          ) : (
                            <Stack sx={{ width: "100%" }}>
                              <Skeleton
                                sx={{
                                  height: "300px",
                                  width: "100%",
                                  transformOrigin: "0 0",
                                }}
                              />
                            </Stack>
                          )}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Stack>
                );
              }}
            />
          </TabPanel>
        </TabContext>
        <ButtonGroup
          fullWidth
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={() => {
              if (watch("activePanel") === "panel2") {
                setValue("content", aicontent, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                // @ts-ignore
                setValue("title", aititle, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                setValue("activePanel", "panel1", {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }
              setTab("1");
            }}
            disabled={tab === "1"}
          >
            {tab === "1"
              ? ""
              : watch("activePanel") === "panel1"
              ? "Edit MY Content"
              : "Edit AI Content"}
          </Button>
          <Button
            onClick={() => {
              if (tab === "1") {
                if (watch("content").length < 250) {
                  toast.error(
                    "We have a minimum requirement for the length of content that can be posted. Please ensure that your post provides sufficient information and details."
                  );
                  return;
                }
                setTab("2");
              } else if (tab === "2") {
                setTagsDialog(true);
              }
            }}
          >
            {tab === "1"
              ? "Continue"
              : watch("activePanel") === "panel1"
              ? "Submit MY Content"
              : "Submit AI Content"}
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}
console.log("tagsArray", tagsArray);
const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  {
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
  { title: "Casablanca", year: 1942 },
  { title: "City Lights", year: 1931 },
  { title: "Psycho", year: 1960 },
  { title: "The Green Mile", year: 1999 },
  { title: "The Intouchables", year: 2011 },
  { title: "Modern Times", year: 1936 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "Rear Window", year: 1954 },
  { title: "The Pianist", year: 2002 },
  { title: "The Departed", year: 2006 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "Back to the Future", year: 1985 },
  { title: "Whiplash", year: 2014 },
  { title: "Gladiator", year: 2000 },
  { title: "Memento", year: 2000 },
  { title: "The Prestige", year: 2006 },
  { title: "The Lion King", year: 1994 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Alien", year: 1979 },
  { title: "Sunset Boulevard", year: 1950 },
  {
    title:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { title: "The Great Dictator", year: 1940 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "The Lives of Others", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Paths of Glory", year: 1957 },
  { title: "Django Unchained", year: 2012 },
  { title: "The Shining", year: 1980 },
  { title: "WALL·E", year: 2008 },
  { title: "American Beauty", year: 1999 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Aliens", year: 1986 },
  { title: "Oldboy", year: 2003 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Das Boot", year: 1981 },
  { title: "Citizen Kane", year: 1941 },
  { title: "North by Northwest", year: 1959 },
  { title: "Vertigo", year: 1958 },
  {
    title: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Braveheart", year: 1995 },
  { title: "M", year: 1931 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Amélie", year: 2001 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Like Stars on Earth", year: 2007 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Double Indemnity", year: 1944 },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { title: "Amadeus", year: 1984 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Logan", year: 2017 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "Dangal", year: 2016 },
  { title: "The Sting", year: 1973 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Toy Story", year: 1995 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "The Kid", year: 1921 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];
