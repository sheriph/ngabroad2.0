import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  List,
  ListItem,
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
  sidebarFilter_,
} from "../../lib/recoil";
import { styled } from "@mui/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { countries, tags } from "../../lib/utility";
import { flatten, get, uniq } from "lodash";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function DesktopSideBar({ post, ssrTags }) {
  const [category, setCategory] = useRecoilState(category_);
  const router = useRouter();
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const [postReplyData, setPostReplyData] = useRecoilState(postReplyData_);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);

  console.log("router", router.pathname);

  const [sidebarFilter, setSidebarFilter] = useRecoilState(sidebarFilter_);

  const handleFilter = (e) => {
    console.log("e.target.innerText", e.target.innerText);
    const newArray = [...sidebarFilter];
    const newRenderFilter = newArray.map((filter) => {
      if (filter.name === e.target.innerText) {
        return { name: filter.name, check: !filter.check };
      }
      return filter;
    });
    setSidebarFilter([...newRenderFilter]);
  };

  console.log("ssrTags", ssrTags);

  React.useEffect(() => {
    const tag1 = ssrTags.map((item) => get(item, "tags.countries", []));
    const tag2 = ssrTags.map((item) => get(item, "tags.otherTags", []));
    console.log("running", tag1, tag2, flatten(tag1), flatten(tag2));

    const allTags = [
      "start",
      "post",
      "question",
      ...flatten(tag2),
      "end",
      ...flatten(tag1),
    ];

    const uniqValue = uniq(allTags);

    const newFilter = [
      ...uniqValue.map((tag) => ({ name: tag, check: false })),
    ];

    console.log("newFilter", newFilter.length, sidebarFilter.length);

    // @ts-ignore
    setSidebarFilter(
      newFilter.length === sidebarFilter.length ? sidebarFilter : newFilter
    );
  }, [null]);

  console.log("sidebarFilter", sidebarFilter);

  return (
    <Box
      sx={{
        width: "250px",
        position: "fixed",
        overflowY: "scroll",
        overflowX: "hidden",
        bottom: 0,
        top: 80,
        display: { xs: "none", md: "block" },
      }}
    >
      <Stack>
        <List dense component="nav" aria-label="category">
          {sidebarFilter.map((filter, index) => {
            // @ts-ignore
            if (filter.name === "start") {
              return (
                <Box key={filter.name} sx={{ pointerEvents: "none", mb: 1 }}>
                  <Divider sx={{ width: "100%" }}>
                    <Chip size="small" label="Tags" color="primary" />
                  </Divider>
                </Box>
              );
            }
            // @ts-ignore
            if (filter.name === "end") {
              return (
                <Box key={filter.name} sx={{ pointerEvents: "none", my: 1 }}>
                  <Divider sx={{ width: "100%" }}>
                    <Chip size="small" label="Countries" color="primary" />
                  </Divider>
                </Box>
              );
            }
            return (
              <ListItem key={filter.name}>
                <CustomListItemButton
                  selected={filter.check}
                  onClick={handleFilter}
                >
                  <ListItemIcon>
                    {filter.check ? (
                      <DoneAllOutlinedIcon />
                    ) : (
                      <AddOutlinedIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ variant: "caption" }}
                    primary={filter.name}
                  />
                </CustomListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/*  <Divider sx={{ my: 2 }} />

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
        </Button> */}
      </Stack>
    </Box>
  );
}
