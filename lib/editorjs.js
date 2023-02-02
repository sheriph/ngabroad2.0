import { Box, Button, Paper, Stack, TextField } from "@mui/material";
import React from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "editorjs-header-with-alignment";
import List from "@editorjs/list";
import Delimiter from "@editorjs/delimiter";
import ImageTool from "@editorjs/image";
import Strikethrough from "@sotaproject/strikethrough";
import Underline from "@editorjs/underline";
import Marker from "@editorjs/marker";
import Table from "@editorjs/table";
import Embed from "@editorjs/embed";
import { get } from "lodash";
import EditorJSRender from "./editorjsrender";

export default function EditorJs() {
  const [data, setData] = React.useState([]);
  let editor;
  const uploadImage = (file) => {
    console.log("file", file);
    return {
      success: 1,
      file: {
        url: "https://thumbs.dreamstime.com/b/yellow-orange-starburst-flower-nature-jpg-192959431.jpg",
        // any other image data you want to store, such as width, height, color, extension, etc
      },
    };
  };
  React.useEffect(() => {
    editor = new EditorJS({
      holder: "editorjs",
      tools: {
        header: {
          // @ts-ignore
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header",
            defaultLevel: 2,
            levels: [2, 3],
            defaultAlignment: "center",
          },
        },
        list: {
          class: List,
        },
        delimiter: {
          class: Delimiter,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              //  byFile: "/api/imguploader", // Your backend file uploader endpoint
              //   byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
            },
            uploader: {
              uploadByFile: (file) => {
                console.log("file", file);
                return {
                  success: 1,
                  file: {
                    url: "https://thumbs.dreamstime.com/b/yellow-orange-starburst-flower-nature-jpg-192959431.jpg",
                    // any other image data you want to store, such as width, height, color, extension, etc
                  },
                };
              },
            },
          },
        },
        strikethrough: {
          class: Strikethrough,
        },
        underline: {
          class: Underline,
        },
        marker: {
          class: Marker,
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              facebook: true,
              coub: true,
            },
          },
        },
      },
    });
  }, [null]);

  const save = async () => {
    try {
      const data = await editor.save();
      setData(get(data, "blocks", []));
      console.log("data", data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack
        spacing={1}
        component={Paper}
        variant="outlined"
        sx={{ p: 1, position: "relative" }}
      >
        <TextField
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            "& .MuiOutlinedInput-root": {
              borderTopRightRadius: 4,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
          size="small"
          fullWidth
          placeholder="Title"
        />
        <Stack sx={{ pt: 3.5, px: 1 }} id="editorjs"></Stack>
        <Button onClick={save} variant="contained" fullWidth>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}
