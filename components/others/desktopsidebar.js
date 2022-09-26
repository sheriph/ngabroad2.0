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
import { useRecoilState } from "recoil";
import {
  addPost_,
  blockLoading_,
  category_,
  dbFilter_,
  postReplyData_,
  posts_,
  replyPost_,
  sidebarFilter_,
} from "../../lib/recoil";
import { styled } from "@mui/styles";
import { useRouter } from "next/router";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { useFetchPosts } from "../../lib/utility";
import { flatten, get, pullAll, uniq } from "lodash";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function DesktopSideBar({ ssrTags }) {
  const router = useRouter();
  const [blockLoading, setBlockLoading] = useRecoilState(blockLoading_);

  console.log("router", router.pathname);

  const [sidebarFilter, setSidebarFilter] = useRecoilState(sidebarFilter_);
  const [dbFilter, setDBfilter] = useRecoilState(dbFilter_);

  const {
    posts: db_posts,
    isLoading,
    isValidating,
  } = useFetchPosts(ssrTags ? JSON.stringify(dbFilter) : undefined);

  const [posts, setPosts] = useRecoilState(posts_);

  React.useEffect(() => {
    setPosts(db_posts);
  }, [isLoading, isValidating, JSON.stringify(db_posts)]);

  console.log("isLoading, isValidating", isLoading, isValidating);

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
    if (!ssrTags) return;

    const post_type = ["post", "question"];

    const allTags = [
      "post_type",
      ...post_type,
      "tags",
      ...ssrTags.otherTags,
      "countries",
      ...ssrTags.countries,
    ];

    const newFilter = [...allTags.map((tag) => ({ name: tag, check: false }))];

    console.log("newFilter", newFilter, sidebarFilter);

    // @ts-ignore
    setSidebarFilter(
      newFilter.length === sidebarFilter.length ? sidebarFilter : newFilter
    );
  }, [null]);

  React.useEffect(() => {
    if (!ssrTags) return;
    let dbfilterTemplate = {
      post_type: [],
      countries: [],
      otherTags: [],
      index: 1,
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
    const post_type = ["post", "question"];
    const countriesandtags = [...ssrTags.countries, ...ssrTags.otherTags];
    const lessPostType = pullAll(filterValuesArray1, countriesandtags);
    // @ts-ignore
    dbfilterTemplate.post_type = lessPostType;
    const post_typeandtags = [...post_type, ...ssrTags.otherTags];
    const lessCountries = pullAll(filterValuesArray2, post_typeandtags);
    // @ts-ignore
    dbfilterTemplate.countries = lessCountries;
    const post_typeandcountries = [...post_type, ...ssrTags.countries];
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

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  console.log("sidebarFilter", sidebarFilter);

  console.log("posts", posts);

  if (!ssrTags) {
    return (
      <Container>
        {router.pathname === "/forum" ? (
          <></>
        ) : (
          <Button href="/forum">Back to forum posts</Button>
        )}
      </Container>
    );
  }

  return (
    <Box>
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
              <ListItem sx={{ pr: 0 }} key={filter.name}>
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
      </Stack>
    </Box>
  );
}
