import React from "react";
import {
  Box,
  Container,
  Fab,
  Fade,
  Stack,
  useScrollTrigger,
} from "@mui/material";
import Footer from "../components/footer.js/footer";
import Header from "../components/header/header";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import MobileFab from "../components/others/mobilefab";
import HeaderApp from "../components/header/headerapp";
import PropTypes from "prop-types";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import getPosts from "../lib/mongodb/getposts";
import getTags from "../lib/mongodb/gettags";

const PostComponent = dynamic(() => import("../components/postcomponent"), {
  ssr: false,
});

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Questions({ ssrTags }) {
  // @ts-ignore
  return <PostComponent ssrTags={ssrTags} />;
}

export async function getServerSideProps({ params, req }) {
  try {
    const posts = await getPosts();
    // const ssrPosts = posts ? JSON.parse(posts) : undefined;
    const tags = await getTags();
    const ssrTags = tags ? JSON.parse(tags) : undefined;
    return { props: { ssrTags } };
  } catch (err) {
    console.log(err);
    return { props: { ssrTags: [] } };
  }
}
