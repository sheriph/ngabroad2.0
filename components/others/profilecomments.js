import { Button, Divider, Link, Stack } from "@mui/material";
import { default as NextLink } from "next/link";
import { flatten, truncate } from "lodash";
import React from "react";
import { Box } from "@mui/system";

import axios from "axios";

import useSWRInfinite from "swr/infinite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostCard from "../postcard";
import { blockLoading_ } from "../../lib/recoil";
import { useSetRecoilState } from "recoil";
import { titleCase } from "../../lib/utility";
import ArticleRender from "./articlerender";

const getPosts = async (key) => {
  console.log("posts key", key);
  try {
    const posts = await axios.post("/api/others/getusercomments", { key });
    console.log("posts in fetch", posts.data);

    return posts.data;
  } catch (error) {
    console.log("posts error", error.response);
    throw new Error(error);
  }
};

const number = process.env.NODE_ENV === "development" ? 3 : 20;


export default function ProfileComments({ id, commentsCount }) {
  const {
    data: comments,
    error,
    isLoading,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite((pageIndex) => `${pageIndex++}-${number}-${id}`, getPosts, {
    persistSize: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    initialSize: 1,
    keepPreviousData: true,
    revalidateFirstPage: true,
  });

  const setBlockLoading = useSetRecoilState(blockLoading_);

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  const end = flatten(comments).length === commentsCount;

  return (
    <Stack spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
      {flatten(comments).map((comment, key) => (
        <Stack spacing={1} key={key}>
          <NextLink href={`/${encodeURIComponent(comment.slug)}`} passHref>
            <Link
              variant="h2"
              textAlign="left"
              sx={{
                p: 0,
                justifyContent: "flex-start",
                color: "text.primary",
                textDecorationStyle: "dotted",
              }}
              gutterBottom
              underline="always"
            >
              Re:{" "}
              {truncate(titleCase(comment?.title), {
                length: 150,
                omission: " ...",
              })}
            </Link>
          </NextLink>
          <ArticleRender content={comment?.content} />
        </Stack>
      ))}

      {isLoading || end ? (
        ""
      ) : (
        <Box display="flex" justifyContent="center">
          <Button
            onClick={() => setSize((prev) => prev + 1)}
            variant="text"
            endIcon={<ExpandMoreIcon />}
          >
            Load More
          </Button>
        </Box>
      )}
    </Stack>
  );
}
