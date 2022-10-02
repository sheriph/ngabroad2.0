import {
  Autocomplete,
  Button,
  ButtonGroup,
  Collapse,
  Container,
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
import { Box } from "@mui/system";
import PostList from "./postlist";
import { styled } from "@mui/styles";
import DesktopSideBar from "./others/desktopsidebar";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function PostComponent({ ssrTags, ssrPosts }) {
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <Stack direction="row">
      <Box>
        <Drawer
          onClose={handleDrawer}
          keepMounted
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
            <DesktopSideBar ssrPosts={ssrPosts} ssrTags={ssrTags} />
          </Box>
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Mobile Head */}
        <Stack
          justifyContent="center"
          sx={{ display: { xs: "flex", md: "none" }, mb: 1 }}
        >
          <Button onClick={handleDrawer} endIcon={<FilterListIcon />}>
            Filter
          </Button>
        </Stack>
        <PostList />
      </Box>
    </Stack>
  );
}
