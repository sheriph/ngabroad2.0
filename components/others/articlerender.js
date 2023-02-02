import { Box } from "@mui/system";
import ReactHtmlParser, { processNodes } from "react-html-parser";

import React from "react";
import { Link, Stack, Typography } from "@mui/material";
import Image from "next/image";

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1, e2, e3) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r, g, b) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export default function ArticleRender({ content }) {
  // const { data: votes } = useSWRImmutable("", fetchImgProps);

  const transform = (node, index) => {
    if (node.type === "tag" && node.name === "h1") {
      return (
        <Typography
          sx={{ my: 2 }}
          textAlign="center"
          variant="h1"
          component="h1"
          key={index}
        >
          {processNodes(node.children, transform)}
        </Typography>
      );
    }
    if (node.type === "tag" && node.name === "h2") {
      return (
        <Typography
          sx={{ my: 2 }}
          textAlign="center"
          variant="h2"
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

    if (node.type === "text") {
    //  console.log("node.data", node.data);
      return (
        <Typography sx={{ all: "unset" }} component="p" key={index}>
          {node.data}
        </Typography>
      );
    }

    if (node.type === "tag" && node.name === "a") {
      const { href } = node.attribs;
      return (
        <Link
          href={href}
          sx={{
            textDecorationStyle: "dotted",
            textDecorationColor: "primary.main",
          }}
          component="a"
          key={index}
        >
          {processNodes(node.children, transform)}
        </Link>
      );
    }

    if (node.type === "tag" && node.name === "img") {
      const { src, alt, width, height } = node.attribs;

      return (
        <Box
          sx={{ height: { xs: "320px", md: "640px" }, width: "100%" }}
          // display="block"
          justifyContent="center"
          position="relative"
          key={index}
        >
          <Image
            src={src}
            alt={alt}
            style={{ objectFit: "contain" }}
            placeholder="blur"
            fill
            ///   blurDataURL={`data:image/svg+xml;base64,${toBase64(
            //     shimmer(300, 400)
            //    )}`}
            blurDataURL={rgbDataURL(83, 72, 220)}
          />
        </Box>
      );
    }
  };

  const options = {
    decodeEntities: true,
    transform,
  };

  return (
    <Box sx={{ whiteSpace: "pre-wrap" }}>
      {ReactHtmlParser(content, options)}
    </Box>
  );
}
