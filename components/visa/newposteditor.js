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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Controller, useForm } from "react-hook-form";
import { get, keys, keysIn, lowerCase, pickBy, trim, truncate } from "lodash";
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
      .min(20, "Title is too short")
      .trim("")
      .lowercase(""),
    //    .matches(/^[aA-zZ\s\d]+$/, "Only alphanumeric characters"),
    content: Yup.string()
      .min(20, "Comment is too short")
      .when("post_type", {
        is: "post",
        then: Yup.string().required("Content is required"),
      }),
    post_type: Yup.string().required("Post type is required"),
    /*   countries: Yup.array().transform((value, originalValue) => {
        return originalValue.map((item) => item.name);
      }),
      otherTags: Yup.array().transform((value, originalValue) =>
        keysIn(pickBy(originalValue, (val, key) => val === true))
      ), */
  });

  const router = useRouter();

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
    },
  });

  const [termsDialog, setTermsDialog] = useState(false);

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
  } = useSWRImmutable(tab === "2" ? watch("content") : undefined, getAiContent);

  const {
    data: aititle,
    mutate: mutateAiTitle,
    isLoading: isLoadingAiTitle,
    isValidating: isValidatingAiTitle,
  } = useSWRImmutable(
    tab === "2" ? `${watch("content")}\n\n\n\n\n\n\n` : undefined,
    getAiTitle
  );

  // console.log("aititle", aititle);

  const onSubmit = async (data) => {
    console.log("data", data);
    return;
    const { title, /* countries, otherTags, */ content } = data;
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
            {watch("activePanel") === "panel1"
              ? "Edit MY Content"
              : "Edit AI Content"}
          </Button>
          {tab === "1" ? (
            <Button onClick={() => setTab("2")}>Continue</Button>
          ) : (
            <Button type="submit">
              {watch("activePanel") === "panel1"
                ? "Submit MY Content"
                : "Submit AI Content"}
            </Button>
          )}
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}
