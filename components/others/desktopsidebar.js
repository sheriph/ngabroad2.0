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
import { countries, tags, useFetchPosts } from "../../lib/utility";
import { flatten, get, pullAll, uniq } from "lodash";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "5px solid",
    borderColor: "primary.main",
  },
}));

export default function DesktopSideBar({ ssrTags, ssrPosts }) {
  const router = useRouter();

  console.log("router", router.pathname);

  const [sidebarFilter, setSidebarFilter] = React.useState([
    { name: "", check: false },
  ]);

  const [posts, setPosts] = useRecoilState(posts_);

  React.useEffect(() => {
    if (ssrTags) setSidebarFilter(ssrTags);
  }, [JSON.stringify(ssrTags)]);

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

  React.useEffect(() => {
    if (!sidebarFilter) return;
    const filterArray = [...sidebarFilter]
      .filter((item) => item.check)
      .map((item) => item.name);

    //  const post_type = ["post", "question"];
    const post_type = pullAll(
      [...filterArray],
      [...Object.keys(tags), ...countries.map((country) => country.name)]
    );

    const otherTags = pullAll(
      [...filterArray],
      ["post", "question", ...countries.map((country) => country.name)]
    );

    const filterCountries = pullAll(
      [...filterArray],
      ["post", "question", ...Object.keys(tags)]
    );
    const filterArguments = {
      post_type,
      otherTags,
      countries: filterCountries,
    };
    console.log("filterArguments", filterArguments);
    const newPosts = [...ssrPosts].filter((post) => {
      if (
        post_type.length === 0 &&
        otherTags.length === 0 &&
        filterCountries.length === 0
      ) {
        return true;
      }
      let condition = [];
      if (post_type.length > 0) {
        condition.push(post_type.includes(post.post_type));
      }
      if (otherTags.length > 0) {
        condition.push(
          otherTags.toString().includes(post.tags.otherTags.toString())
        );
      }
      if (filterCountries.length > 0) {
        condition.push(
          filterCountries.toString().includes(post.tags.countries.toString())
        );
      }

      return condition.includes(true);
    });

    console.log("newPosts", newPosts);
    // @ts-ignore
    setPosts(newPosts);
  }, [
    sidebarFilter
      .filter((item) => item.check)
      .map((item) => item.name)
      .toLocaleString(),
  ]);

  console.log("sidebarFilter", sidebarFilter);

  console.log("posts", posts);

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
