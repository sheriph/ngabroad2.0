import { Stack } from "@mui/material";
import React from "react";
//import EditorJs from "../lib/editorjs";
import dynamic from "next/dynamic";

const EditorJs = dynamic(() => import("../lib/editorjs"), {
  ssr: false,
});

export default function Sample() {
  return (
    <Stack sx={{ p: 2 }}>
      {/* // 
    @ts-ignore */}
      <EditorJs />
    </Stack>
  );
}
