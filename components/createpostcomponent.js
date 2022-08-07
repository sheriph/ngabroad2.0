import {
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
import { trim } from "lodash";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { isLoading_ } from "../lib/recoil";

export default function CreatePostComponent() {
  const { loading, user, mutate } = useUser();

  const schema = Yup.object().shape({
    title: Yup.string()
      .required("Please enter the title")
      .min(20, "Title is too short")
      .matches(/^[aA-zZ\s\d]+$/, "Only alphanumeric characters"),
    post: Yup.string()
      .required("Content is required")
      .min(20, "Content is too short. Please write some content"),
    tags: Yup.array()
      .required("Please select atleat 2 tags")
      .min(2, "Please select atleat 2 tags"),
  });

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { tags: [], title: "", post: "", accept: false },
    resolver: yupResolver(schema),
  });
  const [options, setOptions] = useState([]);
  const [tagsDialog, setTagsDialog] = useState(false);
  const [termsDialog, setTermsDialog] = useState(false);
  const setLoading = useSetRecoilState(isLoading_);

  useEffect(() => {
    // setAuotComleteValue(getValues("tags"));
  }, [null]);

  useEffect(() => {
    const options = getValues("tags").length === 0 ? countries : postTags;
    // @ts-ignore
    getValues("tags").length === 3 ? setOptions([]) : setOptions(options);
  }, [watch("tags").toString()]);

  const getPlaceholder = () => {
    switch (getValues("tags").length) {
      case 0:
        return "Select Tag 1";
      case 1:
        return "Select Tag 2";
      case 2:
        return "Select Tag 3";
      default:
        return "";
    }
  };

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

  const placeholder = getPlaceholder();

  //console.log('watch("tags"', watch("tags"));

  console.log(" createpost user", errors);

  /* if (!user) {
    return (
      <Stack spacing={2}>
        <Typography textAlign="center" variant="h1">
          {loading ? "Verifying login status" : "Please login to continue"}
        </Typography>
        <Skeleton variant="rectangular" width="100%" height="40px" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
        <Skeleton variant="rectangular" width="100%" height="400px" />
      </Stack>
    );
  } */

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
      <Typography textAlign="center" variant="h1">
        Create A New Post
      </Typography>

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
              placeholder="Title"
              variant="outlined"
              required
              error={Boolean(errors?.title?.message)}
              helperText={
                <Typography variant="caption">
                  {errors?.title?.message}
                </Typography>
              }
            />
          );
        }}
      />
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
                {errors?.post?.message}
              </Typography>
            </Box>
          );
        }}
      />
      <Controller
        name="accept"
        defaultValue={false}
        control={control}
        render={({ field }) => {
          const { onChange, value, ...rest } = field;
          return (
            <Stack
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              direction="row"
            >
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
      <Button type="submit" fullWidth variant="contained">
        Submit
      </Button>
      <GeneralDialog
        open={tagsDialog}
        setOpen={setTagsDialog}
        title="About Tags"
      >
        Tags consist of keywords that are related to this post. It allows people
        to find your post quicker. Tags consist of a country that is repeated
        most in your post and two other travel related tags. If the post is not
        about a specific country, you can select ALL for the country tag
      </GeneralDialog>
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
      <Wait />
    </Stack>
  );
}
