import {
  Autocomplete,
  Button,
  Collapse,
  Divider,
  Fab,
  ListItemButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PostCard from "./postcard";
import { Box } from "@mui/system";
import { useRecoilState } from "recoil";
import { category_, filter_, selectCountry_ } from "../lib/recoil";

import MobileFab from "./others/mobilefab";
import MobileCategoryChanger from "./others/mobilecategorychanger";

export default function PostList() {
  const [filter, setFilter] = useRecoilState(filter_);

  const handleFilterChange = (event, newAlignment) => {
    console.log("newAlignment", newAlignment);
    if (newAlignment) setFilter(newAlignment);
  };

  return (
    <Box
      sx={{
        position: { xs: "inherit", md: "relative" },
        left: { xs: 0, md: "250px" },
        width: { xs: "100%", md: "calc(100% - 270px)" },
        marginLeft: { xs: `0 !important`, md: `16px !important` },
      }}
    >
      <Stack spacing={1}>
        {/* Mobile Head */}
        <Stack spacing={1} sx={{ display: { xs: "flex", md: "none" } }}>
          {/* <MobileFab /> */}
          <Stack spacing={2} direction="row"></Stack>
          <Stack justifyContent="space-between" direction="row" spacing={2}>
            <MobileCategoryChanger />
            <ToggleButtonGroup
              color="primary"
              value={filter}
              exclusive
              size="small"
              onChange={handleFilterChange}
            >
              <ToggleButton value="Newest">Newest</ToggleButton>
              <ToggleButton value="Popular">Popular</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
        {/* Desktop head */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Typography>523 results</Typography>
          <Stack direction="row" spacing={2}>
            <ToggleButtonGroup
              color="primary"
              value={filter}
              exclusive
              size="small"
              onChange={handleFilterChange}
            >
              <ToggleButton value="Newest">Newest</ToggleButton>
              <ToggleButton value="Popular">Popular</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
        <Divider orientation="horizontal" flexItem />
        <Stack
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={3}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((post, key) => {
            return <PostCard key={key} post={post} />;
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
