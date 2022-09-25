import { Box } from "@mui/system";
import ReactHtmlParser, { processNodes } from "react-html-parser";

import React from "react";
import { Typography } from "@mui/material";

export default function IntroRender({ content }) {
  const transform = (node, index) => {
    if (node.type === "tag" && node.name === "h2") {
      return (
        <Typography
          sx={{ my: "15px", fontWeight: "bold" }}
          component="span"
          key={index}
        >
          {processNodes(node.children, transform)}
        </Typography>
      );
    }

    if (node.type === "tag" && node.name === "h1") {
      return (
        <Typography
          sx={{ my: "15px", fontWeight: "bold" }}
          component="span"
          key={index}
        >
          {processNodes(node.children, transform)}
        </Typography>
      );
    }

    if (node.type === "tag" && node.name === "img") return <></>;
    if (node.type === "tag" && node.name === "figure") return <></>;

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
