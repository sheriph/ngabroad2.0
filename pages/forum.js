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

const PostComponent = dynamic(() => import("../components/postcomponent"), {
  ssr: false,
});

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Questions({ ssrPosts }) {
  console.log("ssrPosts", ssrPosts);
  return (
    <Container disableGutters>
      <Stack id="headerId" spacing={1}>
        <MobileFab post={null} />
        <Box component={Container}>
          <HeaderApp />
          <HeaderAppOffset />
          {/* // 
      @ts-ignore */}
          <PostComponent ssrPosts={ssrPosts} />
        </Box>
        <Footer />
      </Stack>
    </Container>
  );
}

export async function getServerSideProps({ params, req }) {
  try {
    const posts = await getPosts();
    const ssrPosts = posts ? JSON.parse(posts) : undefined;
    return { props: { ssrPosts } };
  } catch (err) {
    console.log(err);
    return { props: { ssrPosts: [] } };
  }
}
