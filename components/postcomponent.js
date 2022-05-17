import {
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import React, { useEffect } from "react";
import PostCard from "./postcard";
import NotListedLocationOutlinedIcon from "@mui/icons-material/NotListedLocationOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { TagCloud } from "react-tagcloud";
import PostList from "./postlist";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { pageBreadcrumb_ } from "../lib/recoil";
import SingleQuestionCard from "./singlequestioncard";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function PostComponent() {
  const [pageBreadcrumb, setPageBreadcrumb] = useRecoilState(pageBreadcrumb_);

  const handlePageBreadcrumb = (event) => {
    console.log("click", event);
    setPageBreadcrumb(event.target.innerText);
  };

  useEffect(() => {
    setPageBreadcrumb("All");
  }, [null]);

  return (
    <Stack
      sx={{ backgroundColor: "common.white", p: { xs: 1, sm: 2 } }}
      direction="row"
      spacing={2}
    >
      <Box
        sx={{
          width: "250px",
          position: "fixed",
          display: { xs: "none", md: "block" },
        }}
      >
        <Stack>
          <List dense component="nav" aria-label="pageBreadcrumb">
            <CustomListItemButton
              selected={pageBreadcrumb === "All"}
              onClick={handlePageBreadcrumb}
            >
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="All" />
            </CustomListItemButton>
            <CustomListItemButton
              selected={pageBreadcrumb === "Questions"}
              onClick={handlePageBreadcrumb}
            >
              <ListItemIcon>
                <NotListedLocationOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Questions" />
            </CustomListItemButton>
            <CustomListItemButton
              selected={pageBreadcrumb === "Posts"}
              onClick={handlePageBreadcrumb}
            >
              <ListItemIcon>
                <ArticleOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Posts" />
            </CustomListItemButton>
            {/*  <CustomListItemButton
              selected={pageBreadcrumb === "Users"}
              onClick={handlePageBreadcrumb}
            >
              <ListItemIcon>
                <PeopleAltOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </CustomListItemButton> */}
          </List>
        </Stack>
      </Box>
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
      {/* <PostList /> */}
      <SingleQuestionCard />
    </Stack>
  );
}
