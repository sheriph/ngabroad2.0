import { Box } from "@mui/system";
import ReactHtmlParser, { processNodes } from "react-html-parser";

import React from "react";
import { Typography } from "@mui/material";

export default function IntroRender({ content }) {
  const transform = (node, index) => {
    if (node.type === "tag" && node.name === "h2") return null;

    if (node.type === "tag" && node.name === "h1") return null;

    if (node.type === "tag" && node.name === "img") return null;
    if (node.type === "tag" && node.name === "figure") return null;

    if (node.type === "text") {
     // console.log("node.data", node.data);
      return (
        <Typography sx={{ all: "unset" }} component="p" key={index}>
          {node.data}
        </Typography>
      );
    }

    if (node.type === "tag" && node.name === "p") {
      return (
        <Typography component="span" key={index}>
          {processNodes(node.children, transform)}
        </Typography>
      );
    }
  };

  const options = {
    decodeEntities: true,
    transform,
  };

  return <Box>{ReactHtmlParser(content, options)}</Box>;
}
