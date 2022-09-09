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
import { flatten, get, pullAll, uniq } from "lodash";
import useSWRImmutable from "swr/immutable";
import axios from "axios";


const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

const fetchPosts = async (key) => {
  try {
    const dbFilter = JSON.parse(key);
    console.log("dbFilter in fetch", dbFilter);
    const posts = await axios.post("/api/getposts", { ...dbFilter });
    console.log("posts", posts.data);
    return posts.data;
  } catch (error) {
    console.log("error", error);
  }
};

export default function DesktopSideBar({ ssrTags }) {
  const [category, setCategory] = useRecoilState(category_);
  const router = useRouter();
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const [postReplyData, setPostReplyData] = useRecoilState(postReplyData_);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);

  console.log("router", router.pathname);

  const [sidebarFilter, setSidebarFilter] = useRecoilState(sidebarFilter_);
  const [dbFilter, setDBfilter] = React.useState({
    post_type: [],
    countries: [],
    otherTags: [],
  });

  const {
    data: posts,
    mutate,
    isValidating,
    isLoading,
  } = useSWRImmutable(JSON.stringify(dbFilter), fetchPosts, {
    keepPreviousData: true,
  });

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
    const tag1 = uniq(flatten(ssrTags.map((doc) => doc.tags.countries)));
    const tag2 = uniq(flatten(ssrTags.map((doc) => doc.tags.otherTags)));
    const post_type = ["post", "question"];

    const allTags = [
      "post_type",
      ...post_type,
      "tags",
      ...tag2,
      "countries",
      ...tag1,
    ];

    const newFilter = [...allTags.map((tag) => ({ name: tag, check: false }))];

    console.log("newFilter", newFilter, sidebarFilter);

    // @ts-ignore
    setSidebarFilter(
      newFilter.length === sidebarFilter.length ? sidebarFilter : newFilter
    );
  }, [null]);

  React.useEffect(() => {
    let dbfilterTemplate = {
      post_type: [],
      countries: [],
      otherTags: [],
    };
    const filterValuesArray1 = sidebarFilter
      .filter((item) => item.check)
      .map((item) => item.name);
    const filterValuesArray2 = sidebarFilter
      .filter((item) => item.check)
      .map((item) => item.name);
    const filterValuesArray3 = sidebarFilter
      .filter((item) => item.check)
      .map((item) => item.name);
    const tag1 = flatten(ssrTags.map((doc) => doc.tags.countries));
    const tag2 = flatten(ssrTags.map((doc) => doc.tags.otherTags));
    const post_type = ["post", "question"];
    const countriesandtags = [...tag1, ...tag2];
    const lessPostType = pullAll(filterValuesArray1, countriesandtags);
    // @ts-ignore
    dbfilterTemplate.post_type = lessPostType;
    const post_typeandtags = [...post_type, ...tag2];
    const lessCountries = pullAll(filterValuesArray2, post_typeandtags);
    // @ts-ignore
    dbfilterTemplate.countries = lessCountries;
    const post_typeandcountries = [...post_type, ...tag1];
    const lessOtherTags = pullAll(filterValuesArray3, post_typeandcountries);
    // @ts-ignore
    dbfilterTemplate.otherTags = lessOtherTags;

    console.log("dbfilterTemplate", dbfilterTemplate);
    setDBfilter(dbfilterTemplate);
  }, [
    sidebarFilter
      .filter((item) => item.check)
      .map((item) => item.name)
      .toLocaleString(),
  ]);

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
            if (filter.name === "post_type") {
              return (
                <Box key={filter.name} sx={{ pointerEvents: "none", mb: 1 }}>
                  <Divider sx={{ width: "100%" }}>
                    <Chip size="small" label="Post Type" color="primary" />
                  </Divider>
                </Box>
              );
            }
            // @ts-ignore
            if (filter.name === "tags") {
              return (
                <Box key={filter.name} sx={{ pointerEvents: "none", mb: 1 }}>
                  <Divider sx={{ width: "100%" }}>
                    <Chip size="small" label="Tags" color="primary" />
                  </Divider>
                </Box>
              );
            }
            // @ts-ignore
            if (filter.name === "countries") {
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
