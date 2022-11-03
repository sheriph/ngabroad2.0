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
import { useRecoilValue, useSetRecoilState } from "recoil";
import { blockLoading_, postType_ } from "../lib/recoil";
import useSWRInfinite from "swr/infinite";
import axios from "axios";

const getPosts = async (key) => {
  console.log("posts key", key);
  try {
    const posts = await axios.post("/api/getposts", { key });
    console.log("posts in fetch", posts.data);

    return posts.data;
  } catch (error) {
    console.log("posts error", error.response);
    throw new Error(error);
  }
};

export default function PostComponent() {
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawer = () => setDrawerOpen(!drawerOpen);

  const postType = useRecoilValue(postType_);
  const setBlockLoading = useSetRecoilState(blockLoading_);

  const {
    data: posts,
    error,
    isLoading,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (pageIndex) => `${postType}-${pageIndex++}-${4}`,
    getPosts
  );

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  const loading = isLoading || isValidating;

  console.log("posts ", posts, error, size);

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
            <DesktopSideBar setSize={setSize} />
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
        <PostList
          loading={loading}
          // @ts-ignore
          posts={posts}
          setSize={setSize}
        />
      </Box>
    </Stack>
  );
}
