import { Button, Divider, Drawer, Stack, useMediaQuery } from "@mui/material";

import React, { useEffect, useState } from "react";
import PostCard from "./postcard";
import { Box } from "@mui/system";
import ReactVisibilitySensor from "react-visibility-sensor";
import { flatten } from "lodash";
import { BounceLoader } from "react-spinners";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function PostList({ posts = [], setSize, loading }) {
  const visibleCallback = (isVisible) => {
    console.log("isVisible", isVisible);
    /* if (isVisible) */ setSize((size) => size + 1);
  };
  return (
    <Box sx={{ mt: { xs: 0, md: 1 } }}>
      <Stack>
        <Stack
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {flatten(posts).map((post, index) => (
            <React.Fragment key={index}>
              <PostCard key={index} post={post} />
            </React.Fragment>
          ))}

          {loading ? (
            ""
          ) : (
            <Box display="flex" justifyContent="center">
              <Button
                onClick={visibleCallback}
                variant="text"
                endIcon={<ExpandMoreIcon />}
              >
                Load More
              </Button>
            </Box>
          )}

          {/* <Button onClick={() => setSize((size) => size + 1)}>LOAD MORE</Button> */}
        </Stack>
      </Stack>
    </Box>
  );
}
