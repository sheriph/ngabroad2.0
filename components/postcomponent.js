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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { blockLoading_, postType_ } from "../lib/recoil";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import FilterList from "./others/filterlist";
import { debounce } from "lodash";
import BlockingLoading from "./others/blockingloading";

const number = process.env.NODE_ENV === "development" ? 1 : 30;

const getPosts = async (key) => {
  const { index, url, text } = JSON.parse(key);
  try {
    const posts = await axios.post(url, {
      offset: index === 0 ? Number(index) : Number(index) * number,
      limit: number,
      text,
    });
    // console.log("posts in fetch", posts.data);

    return posts.data;
  } catch (error) {
    console.log("posts error", error.response);
    throw new Error(error);
  }
};

export default React.memo(function PostComponent() {
  const [searchKey, setSearchKey] = React.useState("");
  const [searkeyLive, setSearkeyLive] = React.useState("");
  const handleSearchKey = (e) => {
    const value = e.target.value;
    setSearchKey(value);
  };

  const getKey = (index, previousPageData) => {
    // console.log("index", index, previousPageData);
    if (previousPageData && !previousPageData.length) {
      return undefined;
    }
    return JSON.stringify({
      index,
      url: "/api/others/getposts",
      tag: "Get paginated posts on forum home",
      text: searkeyLive.length > 4 ? `${searkeyLive}` : "",
    });
  };
  const {
    data: posts,
    error,
    isLoading,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(getKey, getPosts, {
    keepPreviousData: true,
    revalidateFirstPage: true,
    // revalidateOnFocus: true,
    revalidateOnMount: true,
    //  revalidateOnReconnect: true,
  });

  console.log("posts ", posts, size);

  const runSearch = () => {
    setSearkeyLive(searchKey);
  };

  return (
    <Stack>
      <BlockingLoading isAnimating={isLoading || isValidating} />
      <Stack spacing={1}>
        <TextField
          sx={{ mb: 2 }}
          id="standard-basic"
          fullWidth
          value={searchKey}
          onChange={handleSearchKey}
          // label=""
          placeholder="Study in Canada ..."
          variant="standard"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={runSearch}>Search</Button>
              </InputAdornment>
            ),
          }}
        />
        <PostList posts={posts} setSize={setSize} />
      </Stack>
    </Stack>
  );
});

/* InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FilterList />
              </InputAdornment>
            ),
          }} */
