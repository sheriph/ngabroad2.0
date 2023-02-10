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
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import slugify from "slugify";

const tagTitles = tagsArray.map((tag) => tag.item);
//console.log("tagTitles", tagTitles);

const tagsObj = tagTitles.reduce((acc, key) => {
  acc[key] = [];
  return acc;
}, {});

export default function ReplyCommentEditor({ post = null, replyPost = null }) {
  const [aiAssitedAlert, setaiAsistedAlert] = React.useState(false);
  const [fetchAIcontent, setFetchAIcontent] = React.useState(false);

  //console.log("inside newcomment post", post);

  const {
    user: userExist,
    authStatus,
    route,
  } = useAuthenticator((context) => [context.authStatus]);
  const { user, isLoading: loading } = useAuthUser(userExist);
  console.log("user", user?._id, authStatus);

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
      then: Yup.string().required(
        "Please provide content. Content field is required"
      ),
    }),
    aicontent: Yup.string().when("tab", {
      is: "1",
      then: Yup.string().required(
        "Please provide Content. Content field is required"
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
      content: "",
      tab: "1",
      ...tagsObj,
      aicontent: "",
    },
  });

  const [tagsDialog, setTagsDialog] = useState(false);

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
      const commentContent = tab === "1" ? aicontent : content;
      const prowrite = tab === "1" ? true : false;
      const comment = {
        user_id: user._id,
        content: commentContent,
        prowrite,
        post: post,
        replyPost,
      };
      console.log("comment", comment);

      await axios.post("/api/others/createcomment", comment);
      toast.success("Awesome! Your comment has been created successfully");
      router.reload();
    } catch (error) {
      console.log(error?.response?.data, error?.response);
      toast.error("Comment creation took a tumble, let's try again!");
    }
  };

  console.log("errors", errors);

  const proWrite = () => {
    if (watch("aicontent").length < 100) {
      toast.error(
        "Our ProWrite feature requires a minimum of 100 characters to be written before optimization can occur"
      );
      return;
    }
    setaicontent(watch("aicontent"));
    setFetchAIcontent(true);
  };

  React.useEffect(() => {
    console.log("CHANGES CAPTURED");
    if (presentaicontent === watch("aicontent")) return;
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

  // return <>hello</>;

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
            <Alert icon={<FormatQuoteIcon />} variant="outlined" sx={{ mb: 2 }}>
              <ArticleRender
                content={
                  // @ts-ignore
                  replyPost?.content
                }
              />
            </Alert>
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
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="2">
            <Alert icon={<FormatQuoteIcon />} variant="outlined" sx={{ mb: 2 }}>
              <ArticleRender
                content={
                  // @ts-ignore
                  replyPost?.content
                }
              />
            </Alert>
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
                  type="submit"
                >
                  Submit
                </Button>
              </ButtonGroup>
            </Stack>
          </TabPanel>
        </TabContext>
      </Stack>
    </Stack>
  );
}
