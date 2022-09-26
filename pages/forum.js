import React from "react";
import dynamic from "next/dynamic";
import useSWRImmutable from "swr/immutable";
import axios from "axios";
import { Container } from "@mui/material";

const PostComponent = dynamic(() => import("../components/postcomponent"), {
  ssr: false,
});

const getSsRTags = async () => {
  console.log("fetching this");
  try {
    const tags = await axios.get("/api/gettags");
    console.log("tags", tags.data);
    return tags.data;
  } catch (err) {
    console.log("getSsRTags error", err);
    throw new Error("error");
  }
};

export default function Questions() {
  const { data: ssrTags } = useSWRImmutable("getSsRTags", getSsRTags);

  console.log("ssrTags", ssrTags);
  // @ts-ignore
  return (
    <Container>
      {/* 
    // @ts-ignore */}
      <PostComponent ssrTags={ssrTags} />
    </Container>
  );
}
