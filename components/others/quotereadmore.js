import ReactHtmlParser, { processNodes } from "react-html-parser";
import React from "react";
import { Link, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import { get, truncate } from "lodash";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

export default function QuoteReadMore({ content }) {
  console.log("content", content);
  const [textLength, setTextLength] = React.useState(100);
  const [showExpand, setShow] = React.useState(true);
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

    if (node.type === "tag" && node.name === "blockquote") {
      return (
        <Box
          sx={{
            borderLeftStyle: "solid",
            borderLeftColor: "primary.main",
            borderLeftWidth: "2px",
            pl: "10px",
            ml: "5px",
            fontStyle: "italic",
            mb: 2,
          }}
          component="div"
          key={index}
        >
          {processNodes(node.children, transform)}
        </Box>
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

  React.useEffect(() => {
    if (textLength >= content?.length) {
      setShow(false);
      setTextLength(content?.length);
    }
  }, [null]);

  if (textLength === content?.length) {
    return (
      <Stack spacing={0}>
        <Box>{ReactHtmlParser(content, options)}</Box>
        {showExpand && (
          <Link
            variant="caption"
            underline="always"
            sx={{
              textDecorationStyle: "dotted",
              alignSelf: "center",
              cursor: "pointer",
              mt: 2,
            }}
            onClick={() => setTextLength(100)}
          >
            Show Less
          </Link>
        )}
      </Stack>
    );
  }
  return (
    <Stack spacing={0}>
      {ReactHtmlParser(
        truncate(content, {
          length: textLength,
          omission: " ...",
        }),
        options
      )}
      {showExpand && (
        <Link
          variant="caption"
          underline="always"
          sx={{
            textDecorationStyle: "dotted",
            alignSelf: "center",
            cursor: "pointer",
            mt: 2,
          }}
          onClick={() => setTextLength(content?.length)}
        >
          Show More
        </Link>
      )}
    </Stack>
  );
}

//const text = `Do you want to study in Iceland? Read on to find everything you need to know about how to study, work and live in Iceland. Iceland is a small island country off the coast of Europe.`;
