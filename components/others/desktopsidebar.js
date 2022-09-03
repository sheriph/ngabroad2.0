import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import React from "react";
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";
import { useRecoilState } from "recoil";
import {
  addPost_,
  category_,
  postReplyData_,
  replyPost_,
} from "../../lib/recoil";
import { styled } from "@mui/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function DesktopSideBar({ post }) {
  const [category, setCategory] = useRecoilState(category_);
  const router = useRouter();
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const [postReplyData, setPostReplyData] = useRecoilState(postReplyData_);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);

  console.log("router", router.pathname);

  const handleCategory = (e) => {
    console.log("e", e);
    setCategory(e.target.innerText);
  };

  return (
    <Box
      sx={{
        width: "250px",
        position: "fixed",
        display: { xs: "none", md: "block" },
      }}
    >
      <Stack>
        <List dense component="nav" aria-label="category">
          <Link href="/forum">
            <CustomListItemButton
              selected={category === "All Posts"}
              onClick={handleCategory}
            >
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="All Posts" />
            </CustomListItemButton>
          </Link>
          <Link href="/forum">
            <CustomListItemButton
              selected={category === "My Timeline"}
              onClick={handleCategory}
            >
              <ListItemIcon>
                <ViewTimelineOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="My Timeline" />
            </CustomListItemButton>
          </Link>
        </List>

        <Divider sx={{ my: 2 }} />

        {router.pathname !== "/forum" && (
          <Button
            startIcon={<PostAddOutlinedIcon sx={{ mr: 3 }} />}
            disableElevation
            sx={{ justifyContent: "flex-start", pl: 3 }}
            // variant="outlined"
            onClick={() => {
              setPostReplyData({
                parentPost: post,
                post: null,
                isComment: false,
              });
              setReplyPost(true);
            }}
          >
            Add Comment
          </Button>
        )}

        <Button
          startIcon={<AssignmentOutlinedIcon sx={{ mr: 3 }} />}
          disableElevation
          sx={{ justifyContent: "flex-start", pl: 3 }}
          // variant="outlined"
          onClick={() => setAddPost(true)}
        >
          Create a Post
        </Button>
      </Stack>
    </Box>
  );
}
