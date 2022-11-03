import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { postType_ } from "../../lib/recoil";
import { styled } from "@mui/styles";
import { useRouter } from "next/router";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { countries, tags, useFetchPosts } from "../../lib/utility";
import {
  flatten,
  get,
  lowerCase,
  pullAll,
  startCase,
  truncate,
  uniq,
} from "lodash";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function DesktopSideBar({ setSize }) {
  const router = useRouter();
  const [postType, setPostType] = useRecoilState(postType_);

  console.log("router", router.pathname);

  const handleFilter = (post_type) => {
    console.log({ post_type });
    if (postType === post_type) {
      setPostType("all");
      setSize(1);
    } else {
      setPostType(post_type);
      setSize(1);
    }
  };

  if (router.pathname !== "/forum") {
    return (
      <Container>
        <Button href="/forum">Back to forum posts</Button>
      </Container>
    );
  } else {
    return (
      <Box>
        <Stack>
          <List dense component="nav" aria-label="category">
            <Box sx={{ pointerEvents: "none", mb: 1 }}>
              <Divider sx={{ width: "100%" }}>
                <Chip size="small" label="Post Type" color="primary" />
              </Divider>
            </Box>
            <ListItem sx={{ pr: 0 }}>
              <CustomListItemButton
                selected={postType === "post"}
                onClick={() => handleFilter("post")}
              >
                <ListItemIcon>
                  {postType === "post" ? (
                    <DoneAllOutlinedIcon />
                  ) : (
                    <AddOutlinedIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ variant: "caption" }}
                  primary="Posts"
                />
              </CustomListItemButton>
            </ListItem>
            <ListItem sx={{ pr: 0 }}>
              <CustomListItemButton
                selected={postType === "question"}
                onClick={() => handleFilter("question")}
              >
                <ListItemIcon>
                  {postType === "question" ? (
                    <DoneAllOutlinedIcon />
                  ) : (
                    <AddOutlinedIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ variant: "caption" }}
                  primary="Questions"
                />
              </CustomListItemButton>
            </ListItem>
          </List>
        </Stack>
      </Box>
    );
  }
}
