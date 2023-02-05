import React from "react";
import dynamic from "next/dynamic";
import getPostPaths from "../lib/mongodb/postpaths";
import getPost from "../lib/mongodb/getpost";
import getPostComments from "../lib/mongodb/getpostcomments";
import { useSetRecoilState } from "recoil";
import { post_ } from "../lib/recoil";
import { Container } from "@mui/material";

const SinglePostComponent = dynamic(
  () => import("../components/others/singlepostcomponent"),
  { ssr: false }
);

export default function Questions({ post }) {
  // console.log("post comments", post, comments);
  const setPost = useSetRecoilState(post_);
  React.useEffect(() => {
    setPost(post);
  }, [null]);
  // @ts-ignore
  return (
    <Container>
      {/* 
// @ts-ignore */}
      <SinglePostComponent post={post} />
    </Container>
  );
}

export const getStaticPaths = async () => {
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
    // console.log("post", post);
    if (!post) throw new Error("post not found");
    const jsonPostComments = await getPostComments(post._id);
    const comments = jsonPostComments ? JSON.parse(jsonPostComments) : [];
    const allPosts = [post, ...comments];
    return { props: { post: allPosts }, revalidate: 20 };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
}
