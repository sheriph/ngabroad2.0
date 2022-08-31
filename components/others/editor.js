import { Skeleton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import Script from "next/script";
import { useRecoilState, useSetRecoilState } from "recoil";
import { editorLoaded_, isLoading_ } from "../../lib/recoil";
import { getAwsUrl } from "../../lib/utility";
import React from "react";

export default function Editor({ onChange, value }) {
  let editor;
  const [editorLoaded, seteditorLoaded] = useRecoilState(editorLoaded_);

  console.log("editorLoaded", editorLoaded);

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

      // @ts-ignore
      xhr.addEventListener("error", () => reject(genericErrorText));
      // @ts-ignore
      xhr.addEventListener("abort", () => reject());
      // @ts-ignore
      xhr.addEventListener("load", () => {
        // @ts-ignore
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
      // @ts-ignore
      if (xhr.upload) {
        // @ts-ignore
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
      // @ts-ignore
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

  const runCkEditor = () => {
    // @ts-ignore
    ClassicEditor.create(document.querySelector("#editor"), {
      //  toolbar:[],
      extraPlugins: [MyCustomUploadAdapterPlugin],
      initialData: value,
    })
      .then((newEditor) => {
        editor = newEditor;
        newEditor.model.document.on("change", () => {
         // console.log("The Document has changed!");
          onChange(editor.getData());
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        console.log("done and style");
      });

    // Assuming there is a <button id="submit">Submit</button> in your application.
    // document
    //   .querySelector("#submit")
    //   .addEventListener("click", onSubmit);
  };

  React.useEffect(() => {
    if (editorLoaded) runCkEditor();
  }, [null]);
  // const mydata = `<p>asdfd</p><blockquote><p>dfdffgffggfg</p></blockquote><figure class="image"><img src="https://ngav21e78a8b3cc4f543578f719d56dc031e1c170205-dev.s3.eu-west-2.amazonaws.com/public/WhatsApp+Image+2021-07-30+at+11.54.17+AM.jpeg"></figure><p>&nbsp;</p>`;

  return (
    <Stack>
      <Stack>
        <Box id="editor">
          <Stack spacing={2}>
            <Skeleton variant="rectangular" sx={{ height: "50px" }} />
            <Skeleton variant="rectangular" sx={{ height: "250px" }} />
          </Stack>
        </Box>
        <Script
          src="https://cdn.ckeditor.com/ckeditor5/34.0.0/classic/ckeditor.js"
          strategy="afterInteractive"
          onError={(e) => {
            console.error("Script failed to load", e);
          }}
          onLoad={() => {
            seteditorLoaded(true);
            // @ts-ignore
            ClassicEditor.create(document.querySelector("#editor"), {
              //  toolbar:[],
              extraPlugins: [MyCustomUploadAdapterPlugin],
              initialData: value,
            })
              .then((newEditor) => {
                editor = newEditor;
                newEditor.model.document.on("change", () => {
                  //console.log("The Document has changed!");
                  onChange(editor.getData());
                });
              })
              .catch((error) => {
                console.error(error);
              })
              .finally(() => {
                console.log("done and style");
              });

            // Assuming there is a <button id="submit">Submit</button> in your application.
            // document
            //   .querySelector("#submit")
            //   .addEventListener("click", onSubmit);
          }}
        />
      </Stack>
    </Stack>
  );
}
