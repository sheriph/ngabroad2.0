import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Autocomplete,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
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
  Switch,
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
import { titleCase, useAuthUser } from "../lib/utility";
import Editor from "./others/editor";
import CloseIcon from "@mui/icons-material/Close";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Radio } from "@mui/material";
import useSWRImmutable from "swr/immutable";
import ArticleRender from "./others/articlerender";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import GradingIcon from "@mui/icons-material/Grading";
import { useTheme } from "@mui/material/styles";
import tagsArray from "../lib/tags";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import CustomizedDialogs from "./others/alert";
import BlockingLoading from "./others/blockingloading";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import useUndo from "use-undo";

const tagTitles = tagsArray.map((tag) => tag.item);
//console.log("tagTitles", tagTitles);

const tagsObj = tagTitles.reduce((acc, key) => {
  acc[key] = [];
  return acc;
}, {});

// @ts-ignore
export default React.memo(function ModifyPostEditor({ post }) {
  const [aiAssitedAlert, setaiAsistedAlert] = React.useState(false);
  const [fetchAIcontent, setFetchAIcontent] = React.useState(false);
  const [tagsDialog, setTagsDialog] = useState(false);

  const { user: userExist, authStatus } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const { user, isLoading: loading } = useAuthUser(userExist);
  console.log("user", user?._id);

  const [
    iniaicontent,
    {
      set: setaicontent,
      reset: resetaicontent,
      undo: undoaicontent,
      redo: redoaicontent,
      canUndo,
      canRedo,
    },
  ] = useUndo("");
  const { present: presentaicontent } = iniaicontent;

  const setOptions = {
    shouldDirty: true,
    shouldTouch: true,
    shouldValidate: true,
  };

  const schema = Yup.object().shape({
    content: Yup.string().when("tab", {
      is: "2",
      then: Yup.string()
        .required("Please provide content. Content field is required")
        .min(
          200,
          "We have a minimum requirement for the length of content that can be posted. Please ensure that your post provides sufficient information and details."
        ),
    }),
    aicontent: Yup.string().when("tab", {
      is: "1",
      then: Yup.string()
        .required("Please provide Content. Content field is required")
        .min(
          200,
          "We have a minimum requirement for the length of content that can be posted. Please ensure that your post provides sufficient information and details."
        ),
    }),
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
    formState: { errors, isValidating, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      content: post?.prowrite ? "" : post?.content,
      tab: "1",
      ...tagsObj,
      aicontent: post?.prowrite ? post?.content : "",
    },
  });

  /*   React.useEffect(() => {
    if (post?.prowrite) {
      console.log("effect", post?.prowrite, post?.content);
      setValue("aicontent", post?.content, setOptions);
    } else {
      console.log("effect", post?.prowrite, post?.content);
      setValue("content", post?.content, setOptions);
    }
  }, [post?.content]); */

  const getAiContent = async (key) => {
    /* setValue("aicontent", content, setOptions);
    setValue("ai", false, setOptions);
    setaicontent(content);
    return content; */
    try {
      const prompt = `Rewrite the content below with improved grammar, readability, and structure:${key}`;
      const max_tokens = 1000;
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      const model = "text-davinci-003";
      const temperature = 0;

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

      const content = trim(get(response, "data.choices[0].text", ""), `"\n`);

      setValue("aicontent", content, setOptions);
      setaicontent(content);
      setFetchAIcontent(false);
      return content;
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
    fetchAIcontent ? presentaicontent : undefined,
    getAiContent
  );

  // console.log("aititle", aititle);

  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      const { content, aicontent, tab } = data;
      const tags = pick(data, tagTitles);
      const tagsArray = flatten(Object.values(tags));
      const postTags = tagsArray.map((tag) => tag.title);
      const postContent = tab === "1" ? aicontent : content;
      const prowrite = tab === "1" ? true : false;
      const editedPost = {
        content: postContent,
        tags: postTags,
        prowrite,
        prevPost: post,
      };
      console.log("editedPost", editedPost);

      await axios.post("/api/others/editpost", editedPost);
      toast.success("Awesome! Your post has been updated successfully");
      router.reload();
    } catch (error) {
      console.log(error?.response?.data, error?.response);
      console.log("error", error);
      toast.error("Post update took a tumble, let's try again!");
    }
  };

  console.log("errors", errors);

  const proWrite = () => {
    if (watch("aicontent").length < 200) {
      toast.error(
        "Our ProWrite feature requires a minimum of 200 characters to be written before optimization can occur"
      );
      return;
    }
    setaicontent(watch("aicontent"));
    setFetchAIcontent(true);
  };

  React.useEffect(() => {
    console.log("CHANGES CAPTURED");
    if (presentaicontent === watch("aicontent")) return;
    if (!presentaicontent) return;
    setValue("aicontent", presentaicontent, setOptions);
    mutateAiContent();
  }, [presentaicontent]);

  React.useEffect(() => {
    console.log("authStatus", authStatus);
    if (authStatus !== "authenticated") {
      console.log("not authenticated");
      router.push(`/login`);
    }
  }, [authStatus]);

  return (
    <Stack>
      <Stack
        sx={{ "& .MuiTabs-scroller": { height: "40px" }, mt: -4 }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
      >
        <BlockingLoading
          isAnimating={
            isSubmitting || isValidatingAiContent || isLoadingAiContent
          }
        />
        {errors.aicontent?.message &&
          isSubmitting &&
          toast.error(errors.aicontent?.message)}
        {errors.content?.message &&
          isSubmitting &&
          toast.error(errors.content?.message)}
        <Dialog
          sx={{
            "&.MuiModal-root.MuiDialog-root": { zIndex: 1420 },
          }}
          open={tagsDialog}
          fullScreen={fullScreen}
          keepMounted
          disablePortal
        >
          <Stack>
            <Alert severity="info">
              <AlertTitle>One Last step - Title & Taging</AlertTitle>
              Generate a suitable title and Tag your post with relevant keywords
              to make it easier for others to discover.
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
                      // rules={{validate}}
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
        <CustomizedDialogs
          open={aiAssitedAlert}
          setOpen={setaiAsistedAlert}
          title="AI Assisted Writing"
        >
          Write with Confidence with NGabroad's ProWrite AI Feature! Create
          posts with ease using this AI-assisted writing feature. ProWrite
          improves your grammar, streamlines structure, and offers title
          suggestions. Regardless of your English skills, share your travel
          experiences with the community confidently. And don't sweat it; AI
          recommendations are just recommendations. You have the final say on
          what stays and what goes, always in control of your content and title.
          Join the growing NGabroad community with ease!
        </CustomizedDialogs>
        <TabContext value={watch("tab")}>
          <TabList
            onChange={(event, newValue) =>
              setValue("tab", newValue, setOptions)
            }
          >
            <Tab
              icon={<AutoFixHighIcon fontSize="small" />}
              iconPosition="start"
              sx={{ minHeight: 0 }}
              label="ProWrite Editor"
              value="1"
              wrapped
            />
            <Tab
              sx={{ minHeight: 0 }}
              icon={<GradingIcon fontSize="small" />}
              iconPosition="start"
              label="Manual Editor"
              value="2"
              wrapped
            />
          </TabList>
          <TabPanel sx={{ p: 0 }} value="1">
            <Stack spacing={1}>
              <Stack
                sx={{ cursor: "pointer" }}
                onClick={() => setaiAsistedAlert(true)}
                direction="row"
              >
                <LiveHelpIcon
                  fontSize="small"
                  color="secondary"
                  sx={{ cursor: "pointer" }}
                />
                <Typography>About ProWrite</Typography>
              </Stack>
              <Stack sx={{ position: "relative" }}>
                <Controller
                  name="aicontent"
                  control={control}
                  render={({ field }) => {
                    const { onChange, value, ...rest } = field;
                    return (
                      <TextField
                        {...rest}
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        size="small"
                        fullWidth
                        multiline
                        minRows={10}
                        id="prowrtie editor"
                        placeholder="Start typing ..."
                        variant="outlined"
                        required
                        inputProps={{ maxLength: 2000 }}
                        sx={{
                          [`& fieldset`]: {
                            borderRadius: 1,
                          },
                        }}
                      />
                    );
                  }}
                />
                <Stack
                  component={Paper}
                  sx={{
                    position: "absolute",
                    bottom: 1,
                    right: 1,
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    color: "primary.main",
                  }}
                  variant="outlined"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="caption">
                    {watch("aicontent").length}
                  </Typography>
                </Stack>
              </Stack>
              <Grid container>
                <Grid sx={{}} item xs={8}>
                  <ButtonGroup
                    fullWidth
                    variant="contained"
                    aria-label="outlined primary button group"
                    sx={{ borderBottomRightRadius: 0, width: "98%" }}
                  >
                    <Button
                      disabled={!canUndo}
                      sx={{ width: "70px" }}
                      onClick={undoaicontent}
                    >
                      <SkipPreviousIcon />
                    </Button>
                    <Button
                      onClick={proWrite}
                      color="inherit"
                      sx={{ width: "100%" }}
                    >
                      <Badge badgeContent={0} variant="dot" color="success">
                        ProWrite
                      </Badge>
                    </Button>
                    <Button
                      sx={{
                        width: "70px",
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      disabled={!canRedo}
                      onClick={redoaicontent}
                    >
                      <SkipNextIcon />
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    sx={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      height: "100%",
                    }}
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      if (watch("aicontent").length < 200) {
                        toast.error(
                          "Our ProWrite feature requires a minimum of 200 characters to be written before optimization can occur"
                        );
                        return;
                      }
                      setTagsDialog(true);
                    }}
                  >
                    Continue
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="2">
            <Stack spacing={1}>
              <Controller
                name="content"
                control={control}
                render={({ field }) => {
                  const { onChange, value, ...rest } = field;
                  return (
                    <Box>
                      <Editor onChange={onChange} value={value} />
                      <Typography color="error" variant="caption">
                        {get(errors, "post.message")}
                      </Typography>
                    </Box>
                  );
                }}
              />
              <ButtonGroup variant="contained">
                <Button
                  sx={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    height: "100%",
                  }}
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    if (watch("content").length < 200) {
                      toast.error("Minimum of 200 characters are required");
                      return;
                    }
                    setTagsDialog(true);
                  }}
                >
                  Continue
                </Button>
              </ButtonGroup>
            </Stack>
          </TabPanel>
        </TabContext>
      </Stack>
    </Stack>
  );
});
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
