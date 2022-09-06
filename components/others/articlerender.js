import { Box } from "@mui/system";
import ReactHtmlParser, { processNodes } from "react-html-parser";

import React from "react";
import { Typography } from "@mui/material";
import Image from "next/image";

export default function ArticleRender({ content }) {
  const transform = (node, index) => {
    if (node.type === "tag" && node.name === "h2") {
      return (
        <Typography
          sx={{ my: "15px" }}
          variant="h2"
          align="center"
          component="h2"
          key={index}
        >
          {processNodes(node.children, transform)}
        </Typography>
      );
    }

    if (node.type === "tag" && node.name === "p") {
      return (
        <Typography component="p" key={index}>
          {processNodes(node.children, transform)}
        </Typography>
      );
    }

    if (node.type === "tag" && node.name === "img") {
      const { src, alt, width, height } = node.attribs;
      return (
        <Box
          sx={{
            my: 2,
            width: "70%",
            height: "70%",
            mx: "auto",
          }}
          display="block"
          justifyContent="center"
          key={index}
        >
          <Image
            src={src}
            alt={alt}
            width="100%"
            height="100%"
            layout="responsive"
          />
        </Box>
      );
    }
  };

  const options = {
    decodeEntities: true,
    transform,
  };

  return <Box>{ReactHtmlParser(content, options)}</Box>;
}
