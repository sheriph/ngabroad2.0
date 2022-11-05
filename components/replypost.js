import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  RadioGroup,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Editor from "./others/editor";
import {
  countries,
  getAwsUrl,
  HtmlTooltip,
  LinkTypography,
  useAuthUser,
  useHost,
  useUser,
  Wait,
} from "../lib/utility";
import GeneralDialog from "./others/generaldialog";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Script from "next/script";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { get, lowerCase, startCase, trim, truncate } from "lodash";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoading_, postReplyData_, replyPost_ } from "../lib/recoil";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Radio from "@mui/material/Radio";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useRouter } from "next/router";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function ReplyPost() {
  const schema = Yup.object().shape({
    content: Yup.string()
      .required("Content is required")
      .min(20, "Comment is too short"),
  });
  const router = useRouter();

  const [postReplyData, setPostReplyData] = useRecoilState(postReplyData_);
  const { isComment, parentPost, post } = postReplyData;

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { content: ``, accept: false },
  });
  const [termsDialog, setTermsDialog] = useState(false);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);
  const { user: userExist } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const { user } = useAuthUser(userExist);
  const [loading, setLoading] = React.useState(false);

  console.log("postReplyData", postReplyData);

  const onSubmit = async (data) => {
    console.log("data", data);
    const { content } = data;

    try {
      setLoading(true);
      //  setLoading(true);
      // @ts-ignore
      await toast.promise(
        axios.post("/api/others/createpostcomment", {
          content: content,
          // @ts-ignore
          post_id: parentPost._id,
          user_id: user._id,
          // @ts-ignore
          title: parentPost.title,
          // @ts-ignore
          quotedUser_id: get(
            post,
            "user_id",
            "" /* "62fd5507d0b451b394f7dc3a" */
          ),
          // @ts-ignore
          quotedPostContent: get(post, "content", ""),
          // @ts-ignore
          slug: parentPost.slug,
        }),
        {
          success: "Comment posted succesfully",
          error: "Error encountered, try again",
          pending: "Posting comment in progress ...",
        }
      );
      setLoading(false);
      router.reload();
      setReplyPost(false);
    } catch (error) {
      console.log(error?.response?.data);
      setLoading(false);
    }
  };

  console.log("errors", errors);

  return (
    <Stack>
      <Stack
        color="primary"
        sx={{ backgroundColor: "primary.main", py: 1, px: 2 }}
        alignItems="center"
        direction="row"
      >
        <Grid container alignItems="center">
          <Grid item xs></Grid>
          <Grid item xs="auto">
            <Typography color="white" textAlign="center" variant="h1">
              Re :{" "}
              {truncate(
                startCase(
                  lowerCase(
                    // @ts-ignore
                    parentPost.title
                  )
                ),
                {
                  length: 40,
                }
              )}
            </Typography>
          </Grid>
          <Grid
            sx={{ cursor: "pointer" }}
            onClick={() => setReplyPost(false)}
            xs
            item
            container
            justifyContent="flex-end"
          >
            <CloseOutlinedIcon sx={{ color: "white" }} />
          </Grid>
        </Grid>
      </Stack>
      <Stack
        sx={{ p: 2 }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
      >
        <Alert severity="warning">
          <AlertTitle>Tips to writing a good comment</AlertTitle>
          <Stack component="ul">
            <li>
              Try to provide a source if available so your claims can be
              verified
            </li>
            <li>Avoid bullying and racial remarks</li>
          </Stack>
        </Alert>

        <Controller
          name="content"
          defaultValue=""
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
                  {get(errors, "content.message")}
                </Typography>
              </Box>
            );
          }}
        />

        <Stack justifyContent="space-between" direction="row">
          <Controller
            name="accept"
            defaultValue={false}
            control={control}
            render={({ field }) => {
              const { onChange, value, ...rest } = field;
              return (
                <Stack alignItems="center" spacing={1} direction="row">
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography>Terms of Posting</Typography>
                        <Divider />
                        <Typography sx={{ ml: -3 }} component="ul">
                          <li>abdudhsdosdjoisdjoi</li>
                          <li>abdudhsdosdjoisdjoi</li>
                          <li>abdudhsdosdjoisdjoi</li>
                          <li>abdudhsdosdjoisdjoi</li>
                        </Typography>
                      </React.Fragment>
                    }
                    arrow
                  >
                    <FormControlLabel
                      {...rest}
                      value={value}
                      onChange={onChange}
                      control={<Checkbox required />}
                      label="I Agree"
                    />
                  </HtmlTooltip>
                </Stack>
              );
            }}
          />
          <Button
            endIcon={<SendOutlinedIcon />}
            type="submit"
            size="small"
            variant="contained"
            disabled={loading || !isDirty}
          >
            Submit
          </Button>
        </Stack>
        <GeneralDialog
          open={termsDialog}
          setOpen={setTermsDialog}
          title="Posting Rules"
        >
          <ul>
            <li>You should always post to educate</li>
            <li>You should always post to educate</li>
            <li>You should always post to educate</li>
            <li>You should always post to educate</li>
            <li>You should always post to educate</li>
            <li>You should always post to educate</li>
          </ul>
        </GeneralDialog>
      </Stack>
    </Stack>
  );
}
