import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Editor from "../components/others/editor";
import { countries, getAwsUrl, postTags } from "../lib/utility";
import GeneralDialog from "./others/generaldialog";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Script from "next/script";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { trim } from "lodash";

export default function CreatePostComponent() {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { tags: [], title: "", post: "" } });
  const [options, setOptions] = useState([]);
  // const [autoCompleteValue, setAuotComleteValue] = useState([]);
  const [title, setTitle] = useState("");
  const [tagsDialog, setTagsDialog] = useState(false);

  useEffect(() => {
    // setAuotComleteValue(getValues("tags"));
  }, [null]);

  useEffect(() => {
    const options = getValues("tags").length === 0 ? countries : postTags;
    getValues("tags").length === 3 ? setOptions([]) : setOptions(options);
  }, [getValues("tags").toString()]);

  const getPlaceholder = () => {
    switch (getValues("tags").length) {
      case 0:
        return "Select Country";
      case 1:
        return "Select Tag 1";
      case 2:
        return "Select Tag 2";
      default:
        return "";
    }
  };

  let editor;

  const onSubmit = (data) => {
    console.log("data", data);
    const { tags, title, post } = data;
    if (post.length < 20) {
      toast.error("Post is too short");
      return;
    }
    if (title.length < 20) {
      toast.error("Title is too short");
      return;
    }
    if (tags.length < 2) {
      toast.error("Minimum of 2 tags are required");
      return;
    }

    // ...
  };

  class MyUploadAdapter {
    constructor(loader) {
      // The file loader instance to use during the upload.
      this.loader = loader;
    }

    // Starts the upload process.
    upload() {
      return this.loader.file.then(async (file) => {
        const awsUrl = await getAwsUrl(file);
        return new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file, awsUrl);
        });
      });
    }

    // Aborts the upload process.
    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
      const xhr = (this.xhr = new XMLHttpRequest());

      // Note that your request may look different. It is up to you and your editor
      // integration to choose the right communication channel. This example uses
      // a POST request with JSON as a data structure but your configuration
      // could be different.
      xhr.open("POST", "/api/uploadimage", true);
      xhr.responseType = "json";
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;

      xhr.addEventListener("error", () => reject(genericErrorText));
      xhr.addEventListener("abort", () => reject());
      xhr.addEventListener("load", () => {
        const response = xhr.response;

        // This example assumes the XHR server's "response" object will come with
        // an "error" which has its own "message" that can be passed to reject()
        // in the upload promise.
        //
        // Your integration may handle upload errors in a different way so make sure
        // it is done properly. The reject() function must be called when the upload fails.
        if (!response || response.error) {
          return reject(
            response && response.error
              ? response.error.message
              : genericErrorText
          );
        }

        // If the upload is successful, resolve the upload promise with an object containing
        // at least the "default" URL, pointing to the image on the server.
        // This URL will be used to display the image in the content. Learn more in the
        // UploadAdapter#upload documentation.
        resolve({
          default: response.url,
        });
      });

      // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
      // properties which are used e.g. to display the upload progress bar in the editor
      // user interface.
      if (xhr.upload) {
        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }

    // Prepares the data and sends the request.
    _sendRequest(file, awsUrl) {
      // Prepare the form data.
      const data = new FormData();

      data.append("upload", file);

      // Important note: This is the right place to implement security mechanisms
      // like authentication and CSRF protection. For instance, you can use
      // XMLHttpRequest.setRequestHeader() to set the request headers containing
      // the CSRF token generated earlier by your application.

      // Send the request.
      this.xhr.send(awsUrl);
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    console.log("editor", editor);
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      console.log("loader", loader);
      // Configure the URL to the upload script in your back-end here!
      return new MyUploadAdapter(loader);
    };
  }

  const placeholder = getPlaceholder();



  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
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
              onChange={(e) => onChange(trim(e.target.value))}
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
                  ? "Maximum options selected"
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
                      .map((country) => country.name)
                      .includes(e.currentTarget.parentElement.innerText) &&
                    getValues("tags").length > 1
                  ) {
                    console.log(
                      "remove",
                      v,
                      e.currentTarget.parentElement.innerText
                    );
                    onChange([]);
                    return;
                  }
                }
                onChange(v);
              }}
              ChipProps={{ variant: "outlined" }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  //  label="Size small"
                  placeholder={placeholder}
                  helperText={
                    <Typography
                      component="span"
                      variant="caption"
                      onClick={() => setTagsDialog(true)}
                      sx={{ cursor: "pointer" }}
                    >
                      Select related country + 2 tags{" "}
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
          return <Editor onChange={onChange} value={value} />;
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
        Tags consist of keywords that are related to this post. It allows poeple
        to find your post quicker. Tags consist of a country that is repeated
        most in your post and two other travel related tags. If the post is not
        about a specific country, you can select ALL as the country option
      </GeneralDialog>
    </Stack>
  );
}
