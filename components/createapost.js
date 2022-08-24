import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Editor from "./others/editor";
import { countries, getAwsUrl, postTags, useUser, Wait } from "../lib/utility";
import GeneralDialog from "./others/generaldialog";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Script from "next/script";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { get, trim, truncate } from "lodash";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { addPost_, isLoading_ } from "../lib/recoil";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function CreatePost() {
  const schema = Yup.object().shape({
    title: Yup.string()
      .required("Please enter the title")
      .min(20, "Title is too short")
      .matches(/^[aA-zZ\s\d]+$/, "Only alphanumeric characters"),
    post: Yup.string()
      .required("Content is required")
      .min(20, "Comment is too short"),
  });

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", post: "", accept: false },
  });
  const [termsDialog, setTermsDialog] = useState(false);
  const setLoading = useSetRecoilState(isLoading_);
  const [addPost, setAddPost] = useRecoilState(addPost_);

  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      setLoading(true);
      const { title, tags, post } = data;
      /*  const insert = await axios.post("/api/createpost", {
            user,
            title,
            tags: tags.map((t) => t.name),
            post,
          }); */
      // @ts-ignore
      // console.log("insert", insert.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data);
      setLoading(false);
    }
  };

  //console.log('watch("tags"', watch("tags"));

  console.log("eror", errors);

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
              Create a new post
            </Typography>
          </Grid>
          <Grid
            sx={{ cursor: "pointer" }}
            onClick={() => setAddPost(false)}
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
          <AlertTitle>Tips to writing a good post</AlertTitle>
          <Stack component="ul">
            <li>
              Your title should summarize the post in as few words as possible
            </li>
            <li>
              Try to provide a source if available so your claims can be
              verified
            </li>
            <li>Ensure the post is detailed enough to educate your readers</li>
          </Stack>
        </Alert>

        <Controller
          name="title"
          defaultValue=""
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
                placeholder="Start Typing ..."
                variant="outlined"
                required
                inputProps={{ maxLength: 150 }}
                sx={{
                  [`& fieldset`]: {
                    borderRadius: 1,
                  },
                }}
                label="Title"
                error={Boolean(errors?.title?.message)}
                helperText={
                  <Stack component="span" direction="row" spacing={2}>
                    <Typography variant="caption">
                      {get(errors, "title.message")}
                    </Typography>
                  </Stack>
                }
              />
            );
          }}
        />

        <Controller
          name="post"
          defaultValue=""
          control={control}
          render={({ field }) => {
            const { onChange, value, ...rest } = field;
            return (
              <Box
                sx={{
                  border: errors?.post ? "1px solid" : "none",
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

        <Stack justifyContent="space-between" direction="row">
          <Controller
            name="accept"
            defaultValue={false}
            control={control}
            render={({ field }) => {
              const { onChange, value, ...rest } = field;
              return (
                <Stack alignItems="center" spacing={1} direction="row">
                  <FormControlLabel
                    {...rest}
                    value={value}
                    onChange={onChange}
                    control={<Checkbox required />}
                    label="I agree"
                  />
                  <HelpOutlineOutlinedIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setTermsDialog(true)}
                    fontSize="small"
                    color="primary"
                  />
                </Stack>
              );
            }}
          />

          <Button
            endIcon={<SendOutlinedIcon />}
            type="submit"
            size="small"
            variant="contained"
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
