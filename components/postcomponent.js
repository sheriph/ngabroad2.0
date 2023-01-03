import {
  Autocomplete,
  Button,
  ButtonGroup,
  Collapse,
  Container,
  Divider,
  Drawer,
  InputAdornment,
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
import FilterList from "./others/filterlist";
import { debounce } from "lodash";

const number = process.env.NODE_ENV === "development" ? 3 : 30;

const getPosts = async (key) => {
  const { index, url, text } = JSON.parse(key);
  try {
    const posts = await axios.post(url, {
      offset: index === 0 ? Number(index) : Number(index) * number,
      limit: number,
      text,
    });
    console.log("posts in fetch", posts.data);

    return posts.data;
  } catch (error) {
    console.log("posts error", error.response);
    throw new Error(error);
  }
};

export default function PostComponent() {
  const postType = useRecoilValue(postType_);
  const setBlockLoading = useSetRecoilState(blockLoading_);
  const [searchKey, setSearchKey] = React.useState("");
  const [searkeyLive, setSearkeyLive] = React.useState("");
  const handleSearchKey = (e) => {
    const value = e.target.value;
    setSearchKey(value);
    delayedRunSearch();
  };

  const updateSearch = () => {
    setSearkeyLive(searchKey);
  };

  const delayedRunSearch = React.useCallback(debounce(updateSearch, 2000), [
    searchKey,
  ]);

  React.useEffect(() => {
    delayedRunSearch();
    return delayedRunSearch.cancel;
  }, [searchKey, delayedRunSearch]);

  const getKey = (index, previousPageData) => {
    if (previousPageData && !previousPageData.length) {
      //setIsLastProducts(true);
      return null;
    }
    return JSON.stringify({
      index,
      url: "/api/others/getposts",
      tag: "Get paginated posts on forum home",
      text:
        searkeyLive.length > 4 ? `${searkeyLive} ${postType.toString()}` : "",
    });
  };
  console.log("searkeyLive, searchKey", searkeyLive, searchKey);
  const {
    data: posts,
    error,
    isLoading,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(getKey, getPosts, {
    keepPreviousData: true,
  });

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  const loading = isLoading || isValidating;

  console.log("posts ", posts, error, size, number);

  return (
    <Stack>
      {/* <Box>
        <Drawer
          onClose={handleDrawer}
          keepMounted
          open={drawerOpen}
          variant={mobile ? "temporary" : "permanent"}
          sx={{
            width: 250,
            display: { xs: "block", md: "none" },
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
        <Stack sx={{ display: { xs: "none", md: "flex" }, width: 250 }}>
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <DesktopSideBar setSize={setSize} />
          </Box>
        </Stack>
      </Box> */}
      <Stack spacing={1}>
        {/* Mobile Head */}
        {/* <Stack
          justifyContent="center"
          sx={{ display: { xs: "flex", md: "none" }, mb: 1 }}
        >
          <Button onClick={handleDrawer} endIcon={<FilterListIcon />}>
            Filter
          </Button>
        </Stack> */}
        <TextField
          sx={{ mb: 2 }}
          id="standard-basic"
          fullWidth
          value={searchKey}
          onChange={handleSearchKey}
          // label=""
          placeholder="Study in Canada ..."
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FilterList />
              </InputAdornment>
            ),
          }}
        />
        <PostList
          loading={loading}
          // @ts-ignore
          posts={posts}
          setSize={setSize}
        />
      </Stack>
    </Stack>
  );
}
