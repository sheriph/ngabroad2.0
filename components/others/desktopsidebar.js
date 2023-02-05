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

export default function DesktopSideBar() {
  const router = useRouter();
  const [postType, setPostType] = useRecoilState(postType_);

  console.log("router", router.pathname);

  return (
    <Container>
      <Button href="/forum">Back to forum posts</Button>
    </Container>
  );
}
