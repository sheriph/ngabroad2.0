import { Button, Divider, Stack } from "@mui/material";

import { flatten } from "lodash";
import React from "react";
import { Box } from "@mui/system";

import axios from "axios";

import useSWRInfinite from "swr/infinite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostCard from "../postcard";
import { blockLoading_ } from "../../lib/recoil";
import { useSetRecoilState } from "recoil";



const number = process.env.NODE_ENV === "development" ? 3 : 20;

const getPosts = async (key) => {
  console.log("posts key", key);
  try {
    const posts = await axios.post("/api/others/getusercontents", { key });
    console.log("posts in fetch", posts.data);

    return posts.data;
  } catch (error) {
    console.log("posts error", error.response);
    throw new Error(error);
  }
};

export default function ProfileQuestions({ id, questionsCount }) {
  const {
    data: posts,
    error,
    isLoading,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (pageIndex) => `question-${pageIndex++}-${number}-${id}`,
    getPosts,
    {
      persistSize: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      initialSize: 1,
      keepPreviousData: true,
      revalidateFirstPage: true,
    }
  );

  const setBlockLoading = useSetRecoilState(blockLoading_);

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  const end = flatten(posts).length === questionsCount;

  return (
    <Stack spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
      {flatten(posts).map((post, index) => (
        <React.Fragment key={index}>
          <PostCard key={index} post={post} />
        </React.Fragment>
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
