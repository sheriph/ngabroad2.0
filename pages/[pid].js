import React from "react";
import {
  Box,
  Button,
  Container,
  Fab,
  Snackbar,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import Footer from "../components/footer.js/footer";
import Header from "../components/header/header";
import MobileFab from "../components/others/mobilefab";
import dynamic from "next/dynamic";
import { styled } from "@mui/material/styles";
import HeaderApp from "../components/header/headerapp";
import Loading from "../components/others/loading";
import getPostPaths from "../lib/mongodb/postpaths";
import getPost from "../lib/mongodb/getpost";
import getPostComments from "../lib/mongodb/getpostcomments";

const SinglePostComponent = dynamic(
  () => import("../components/others/singlepostcomponent"),
  { ssr: false }
);

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Questions({ post, comments }) {
  console.log("post comments", post, comments);
  return (
    <Stack spacing={1}>
      <Loading />

      <Box component={Container}>
        <HeaderApp post={post} />
        <HeaderAppOffset />
        {/* // 
        @ts-ignore */}
        <SinglePostComponent comments={comments} post={post} />
      </Box>
      <Footer />
    </Stack>
  );
}

export const getStaticPaths = async () => {
  console.log(
    "process.env.SKIP_BUILD_STATIC_GENERATION",
    process.env.SKIP_BUILD_STATIC_GENERATION
  );
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
  try {
    const slugs = await getPostPaths();
    const paths = slugs?.map((slug) => ({ params: { pid: slug.slug } }));
    //  console.log("slugs", paths);
    return { paths, fallback: "blocking" };
  } catch (error) {
    console.log("error catched", error);
  }
};

export async function getStaticProps({ params }) {
  try {
    const jsonPost = await getPost(params.pid);
    const post = jsonPost ? JSON.parse(jsonPost) : undefined;
    console.log("post", post);
    if (!post) throw new Error("post not found");
    const jsonPostComments = await getPostComments(post._id);
    const comments = jsonPostComments ? JSON.parse(jsonPostComments) : [];
    return { props: { post, comments }, revalidate: 20 };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
}
