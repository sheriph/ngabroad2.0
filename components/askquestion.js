import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
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
import { get, trim } from "lodash";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { isLoading_ } from "../lib/recoil";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

export default function AskQuestion() {
  const schema = Yup.object().shape({
    title: Yup.string()
      .required("Please enter the title")
      .min(50, "Question is too short")
      .matches(/^[aA-zZ\s\d]+$/, "Only alphanumeric characters"),
    /*  post: Yup.string()
      .required("Content is required")
      .min(20, "Content is too short. Please write some content"),
    tags: Yup.array()
      .required("Please select atleat 2 tags")
      .min(2, "Please select atleat 2 tags"), */
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
    defaultValues: { title: "", accept: false },
  });
  const [termsDialog, setTermsDialog] = useState(false);
  const setLoading = useSetRecoilState(isLoading_);

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
    <Stack
      sx={{ p: 2 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      spacing={2}
    >
      <Typography textAlign="center" variant="h1">
        Ask a Question
      </Typography>

      <Alert severity="warning">
        <AlertTitle>
          Tips to writing a good question that get answered sooner
        </AlertTitle>
        <Stack component="ul">
          <li>Summarise your question perfectly</li>
          <li>Avoid spelling errors</li>
          <li>Use correct grammar</li>
          <li>
            Use the search option to find similar question. Do not post repeated
            questions. You may follow a similar question thread.
          </li>
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
              multiline
              minRows={3}
              id="title"
              placeholder="Start Typing ..."
              variant="outlined"
              required
              inputProps={{ maxLength: 250 }}
              sx={{
                [`& fieldset`]: {
                  borderRadius: 1,
                },
              }}
              error={Boolean(errors?.title?.message)}
              helperText={
                <Stack component="span" direction="row" spacing={2}>
                  <Typography
                    color={
                      250 - watch("title").length < 21 ? "error" : "primary"
                    }
                    variant="caption"
                  >
                    Remaining : {250 - watch("title").length}
                  </Typography>
                  <Typography variant="caption">
                    {get(errors, "title.message")}
                  </Typography>
                </Stack>
              }
            />
          );
        }}
      />

      {/* 
      <Controller
        name="tags"
        defaultValue={[]}
        control={control}
        render={({ field }) => {
          const { onChange, value, ...rest } = field;
          return (
            <Autocomplete
              {...rest}
              multiple
              noOptionsText={
                getValues("tags").length === 3
                  ? "Maximum tags selected"
                  : "No Options"
              }
              id="size-small-standard-multi"
              size="small"
              value={value}
              options={options}
              onChange={(e, v, r) => {
                if (r === "removeOption") {
                  if (
                    countries
                      // @ts-ignore
                      .map((country) => country.name)
                      // @ts-ignore
                      .includes(e.currentTarget.parentElement.innerText) &&
                    getValues("tags").length > 1
                  ) {
                    console.log(
                      "remove",
                      v,
                      // @ts-ignore
                      e.currentTarget.parentElement.innerText
                    );
                    onChange([]);
                    return;
                  }
                }
                onChange(v);
              }}
              ChipProps={{ variant: "outlined" }}
              // @ts-ignore
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  //  label="Size small"
                  placeholder={placeholder}
                  error={Boolean(errors?.tags)}
                  helperText={
                    <Typography
                      component="span"
                      variant="caption"
                      color={errors?.tags ? "error" : "primary"}
                      onClick={() => setTagsDialog(true)}
                      sx={{ cursor: "pointer" }}
                    >
                      Select 2-3 tags
                      <HelpOutlineOutlinedIcon
                        color="primary"
                        sx={{ fontSize: "12px" }}
                      />
                    </Typography>
                  }
                />
              )}
            />
          );
        }}
      /> */}

      {/*  <Controller
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
                {errors?.post?.message}
              </Typography>
            </Box>
          );
        }}
      /> */}
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
  );
}
