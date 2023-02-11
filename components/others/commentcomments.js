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
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import BlockingLoading from "./blockingloading";
import PostList from "../postlist";
import CommentList from "../commentlist";

const number = process.env.NODE_ENV === "development" ? 1 : 30;

const getPosts = async (key) => {
  const { index, url, text, user_id } = JSON.parse(key);
  try {
    const posts = await axios.post(url, {
      offset: index === 0 ? Number(index) : Number(index) * number,
      limit: number,
      text,
      user_id,
    });
    // console.log("posts in fetch", posts.data);

    return posts.data;
  } catch (error) {
    console.log("posts error", error.response);
    throw new Error(error);
  }
};

// @ts-ignore
export default React.memo(function CommentComponent({ user_id }) {
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
      url: "/api/others/getcomments",
      tag: "Get paginated comments",
      text: searkeyLive.length > 4 ? `${searkeyLive}` : "",
      user_id: user_id,
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
        <CommentList comments={posts} setSize={setSize} />
      </Stack>
    </Stack>
  );
});
