import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  Drawer,
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
  Toolbar,
  Typography,
  useMediaQuery,
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
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <Stack direction="row">
      <Box>
        <Drawer
          onClose={handleDrawer}
          open={drawerOpen}
          variant={mobile ? "temporary" : "permanent"}
          sx={{
            width: 250,
            //  pl: 2,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 250,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <DesktopSideBar ssrTags={null} />
          </Box>
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <PostsCard comments={comments} post={post} />
      </Box>
    </Stack>
  );
}
