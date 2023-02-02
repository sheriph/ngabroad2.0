import {
  Box,
  Container,
  Divider,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { titleCase } from "./utility";
import ReactHtmlParser, { processNodes } from "react-html-parser";
import { first } from "lodash";
import uuid from "react-uuid";
import Image from "next/image";

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

export default function EditorJSRender({ blocks }) {
  console.log("blocks", blocks);
  const transform = (node, index) => {
    /*  if (node.type === "tag" && node.name === "h1") {
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
      console.log("node.data", node.data);
      return (
        <Typography sx={{ all: "unset" }} component="p" key={index}>
          {node.data}
        </Typography>
      );
    } */
    /*  if (node.type === "tag" && node.name === "a") {
      const { href } = node.attribs;
      return (
        <Link href={href} component="a" key={index}>
          {processNodes(node.children, transform)}
        </Link>
      );
    } */
  };

  const options = {
    decodeEntities: true,
    transform,
  };

  return (
    <Container>
      <Stack spacing={1}>
        {blocks.map((block, index) => {
          const { type, data } = block;
          console.log({ type });
          if (type === "header") {
            const { text, level, alignment } = data;
            return (
              <Typography
                align={alignment}
                key={uuid()}
                variant={level === 2 ? "h2" : "h3"}
              >
                {ReactHtmlParser(titleCase(text), options)}
              </Typography>
            );
          }
          if (type === "paragraph") {
            const { text } = data;
            return (
              <Typography key={uuid()}>
                {ReactHtmlParser(text, options)}
              </Typography>
            );
          }
          if (type === "list") {
            const { items, style } = data;
            if (style === "ordered") {
              return (
                <Typography component="ol" key={uuid()}>
                  {items.map((item, key) => (
                    <Typography component="li" key={key}>
                      {ReactHtmlParser(item, options)}
                    </Typography>
                  ))}
                </Typography>
              );
            } else if (style === "unordered") {
              return (
                <Typography component="ul" key={uuid()}>
                  {items.map((item, key) => (
                    <Typography component="li" key={uuid()}>
                      {ReactHtmlParser(item, options)}
                    </Typography>
                  ))}
                </Typography>
              );
            }
          }
          if (type === "delimiter") {
            return <Divider key={uuid()} orientation="horizontal" />;
          }
          if (type === "table") {
            const { withHeadings, content } = data;
            const tableData = withHeadings ? content.slice(1) : content;
            console.log("tableData", tableData);
            return (
              <Table padding="checkbox" aria-label="simple table">
                {withHeadings && (
                  <TableHead>
                    <TableRow>
                      {first(content).map((item, key) => (
                        <TableCell sx={{ p: 1 }} key={uuid()}>
                          {ReactHtmlParser(item, options)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                )}
                <TableBody>
                  {tableData.map((rows, number) => {
                    return (
                      <TableRow key={uuid()}>
                        {rows.map((row, key) => {
                          return (
                            <TableCell
                              sx={{ p: 1 }}
                              key={uuid()}
                              component="th"
                              scope="row"
                            >
                              {ReactHtmlParser(row, options)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            );
          }
          if (type === "image") {
            const {
              caption,
              file: { url },
            } = data;
            return (
              <Stack spacing={1} key={uuid()}>
                <Image
                  src={url}
                  alt={caption}
                  width={800}
                  height={534}
                  placeholder="blur"
                  blurDataURL={rgbDataURL(83, 72, 220)}
                />
                <Typography align="center">{caption}</Typography>
              </Stack>
            );
          }
        })}
      </Stack>
    </Container>
  );
}

/* 

<Box
                sx={{
                  height: { xs: "100vh", md: "640px" },
                  width: { xs: "100%", md: "640px" },
                }}
                justifyContent="center"
                position="relative"
                key={uuid()}
              >
                <Image
                  key={uuid()}
                  src={url}
                  alt={caption}
                  style={{ objectFit: "contain" }}
                  placeholder="blur"
                  fill
                  blurDataURL={rgbDataURL(83, 72, 220)}
                />
                <Typography align="center">Picture</Typography>
              </Box>

*/
