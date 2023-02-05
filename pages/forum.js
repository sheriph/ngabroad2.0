import React from "react";
import dynamic from "next/dynamic";
import useSWRImmutable from "swr/immutable";
import axios from "axios";
import { Container } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";

const PostComponent = dynamic(() => import("../components/postcomponent"), {
  ssr: false,
});

export default React.memo(function Forum() {
  // @ts-ignore
  return (
    <Container maxWidth="lg">
      {/* 
    // @ts-ignore */}
      <PostComponent />
    </Container>
  );
});

/* export async function getStaticProps() {
  try {
    const res = await getPosts();
    const response = res ? JSON.parse(res) : undefined;
    const { posts, sidebarFilter } = response;
    console.log("posts", posts);
    if (!posts) throw new Error("post not found");
    return { props: { posts, sidebarFilter }, revalidate: 20 };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
} */
