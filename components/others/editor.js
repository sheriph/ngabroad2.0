import { Button, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { CKEditor } from "ckeditor4-react";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAwsUrl } from "../../lib/utility";

export default function Editor() {
  let editor;
  const [ready, setReady] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    const data = editor.getData();

    console.log("data", data);

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

  return (
    <Stack>
      <Box id="editor"></Box>
      <Button id="submit" variant="contained" fullWidth>
        Submit
      </Button>
      <Script
        src="https://cdn.ckeditor.com/ckeditor5/34.0.0/classic/ckeditor.js"
        strategy="lazyOnload"
        onLoad={() => {
          // @ts-ignore
          ClassicEditor.create(document.querySelector("#editor"), {
            //  toolbar:[],
            extraPlugins: [MyCustomUploadAdapterPlugin],
          })
            .then((newEditor) => {
              editor = newEditor;
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              console.log("done and style");
              setReady(true);
            });

          // Assuming there is a <button id="submit">Submit</button> in your application.
          document.querySelector("#submit").addEventListener("click", onSubmit);
        }}
      />
    </Stack>
  );
}
