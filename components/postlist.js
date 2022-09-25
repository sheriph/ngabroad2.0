import { Button, Divider, Drawer, Stack, useMediaQuery } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import React, { useEffect, useState } from "react";
import PostCard from "./postcard";
import { Box } from "@mui/system";
import { useRecoilState } from "recoil";
import { blockLoading_, dbFilter_, mobileFilter_, posts_ } from "../lib/recoil";

import { useFetchPosts } from "../lib/utility";

import ReactVisibilitySensor from "react-visibility-sensor";
import DesktopSideBar from "./others/desktopsidebar";

export default function PostList({ ssrTags }) {
  const [blockLoading, setBlockLoading] = useRecoilState(blockLoading_);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [posts, setPosts] = useRecoilState(posts_);
  const handleDrawer = () => setDrawerOpen(!drawerOpen);
  // @ts-ignore
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  const [dbFilter, setDBfilter] = useRecoilState(dbFilter_);
  const {
    posts: db_posts,
    isLoading,
    isValidating,
  } = useFetchPosts(ssrTags ? JSON.stringify(dbFilter) : undefined);

  React.useEffect(() => {
    setPosts(db_posts);
  }, [isLoading, isValidating, JSON.stringify(db_posts)]);

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  console.log("ssrTags", ssrTags);

  const readMore = (isVisible) => {
    console.log("isVisible", isVisible);
    if (isVisible && posts) {
      setDBfilter({ ...dbFilter, index: posts.length / 5 + 1 });
    }
  };

  return (
    <Box
      sx={{
        position: { xs: "inherit", md: "relative" },
        left: { xs: 0, md: "250px" },
        width: { xs: "100%", md: "calc(100% - 270px)" },
        marginLeft: { xs: `0 !important`, md: `16px !important` },
      }}
    >
      <Stack spacing={2}>
        {/* Mobile Head */}
        <Button
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={handleDrawer}
          endIcon={<FilterListIcon />}
        >
          Filter
        </Button>
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawer}>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <DesktopSideBar ssrTags={ssrTags} />
          </Box>
        </Drawer>
        <Stack
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {(posts || []).map((post, index) => (
            <React.Fragment key={index}>
              <PostCard key={index} post={post} />
              <ReactVisibilitySensor
                active={Boolean(posts?.length - 1 === index)}
                onChange={readMore}
              >
                {Boolean(posts?.length - 1 === index) ? (
                  <Box sx={{ width: "100%", height: "30px" }}></Box>
                ) : (
                  <></>
                )}
              </ReactVisibilitySensor>
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  {
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
];
