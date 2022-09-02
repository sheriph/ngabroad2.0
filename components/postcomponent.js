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
import { Box } from "@mui/system";
import PostList from "./postlist";
import { styled } from "@mui/styles";
import DesktopSideBar from "./others/desktopsidebar";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function PostComponent() {
  return (
    <Stack sx={{ p: { xs: 1, sm: 2 } }} direction="row" spacing={2}>
      <DesktopSideBar post={null} />
      <Divider
        sx={{
          position: "relative",
          left: "250px",
          margin: `0 !important`,
          display: { xs: "none", md: "block" },
        }}
        orientation="vertical"
        flexItem
      />
      <PostList />
    </Stack>
  );
}
