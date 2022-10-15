import React from "react";
import dynamic from "next/dynamic";
import useSWRImmutable from "swr/immutable";
import axios from "axios";
import { Container } from "@mui/material";
import getPosts from "../lib/mongodb/getposts";
import { useRecoilState, useSetRecoilState } from "recoil";
import { posts_ } from "../lib/recoil";

const PostComponent = dynamic(() => import("../components/postcomponent"), {
  ssr: false,
});


export default function Forum({ posts: ssrPosts, sidebarFilter }) {
  //const { data: ssrTags } = useSWRImmutable("getSsRTags", getSsRTags);
  console.log("posts sidebarFilter", ssrPosts, sidebarFilter);
  const setPosts = useSetRecoilState(posts_);

  React.useEffect(() => {
    if (ssrPosts) setPosts(ssrPosts);
  }, [JSON.stringify(ssrPosts)]);

  // @ts-ignore
  return (
    <Container>
      {/* 
    // @ts-ignore */}
      <PostComponent ssrPosts={ssrPosts} ssrTags={sidebarFilter} />
    </Container>
  );
}

export async function getStaticProps() {
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
}
