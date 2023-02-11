import {
  Button,
  Chip,
  Divider,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import PostCard from "./postcard";
import { Box } from "@mui/system";
import ReactVisibilitySensor from "react-visibility-sensor";
import { flatten, get, last } from "lodash";
import { BounceLoader } from "react-spinners";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRecoilValue } from "recoil";

export default function PostList({ posts = [], setSize }) {
  const visibleCallback = () => {
    setSize((size) => size + 1);
  };

  const noMorePosts = last(posts)?.length === 0 ? true : false;

  return (
    <Box sx={{ mt: { xs: 0, md: 1 } }}>
      <Stack>
        <Stack
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {flatten(posts).map((post, index) => (
            <React.Fragment key={index}>
              <PostCard
                key={index}
                // @ts-ignore
                post={post}
              />
            </React.Fragment>
          ))}

          {noMorePosts ? (
            <Stack sx={{ py: 4 }}>
              <Divider>
                <Chip label="End" />
              </Divider>
            </Stack>
          ) : (
            <Button
              onClick={visibleCallback}
              variant="text"
              endIcon={<ExpandMoreIcon />}
            >
              Load More
            </Button>
          )}

          {/* <Button onClick={() => setSize((size) => size + 1)}>LOAD MORE</Button> */}
        </Stack>
      </Stack>
    </Box>
  );
}
