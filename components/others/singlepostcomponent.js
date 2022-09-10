import {
  Autocomplete,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import { styled } from "@mui/styles";
import DesktopSideBar from "./desktopsidebar";
import PostsCard from "../postscard";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function SinglePostComponent({ post, comments }) {
  return (
    <Stack sx={{ p: { xs: 1, sm: 2 } }} direction="row" spacing={2}>
      <DesktopSideBar ssrTags={null} />
      <Divider
        sx={{
          position: "relative",
          left: "250px",
          minHeight: 700,
          margin: `0 !important`,
          display: { xs: "none", md: "block" },
        }}
        orientation="vertical"
        flexItem
      />
      <PostsCard comments={comments} post={post} />
    </Stack>
  );
}
