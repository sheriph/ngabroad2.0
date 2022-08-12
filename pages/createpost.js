import React from "react";
import { Container, Stack, TextField } from "@mui/material";
import Header from "../components/header/header";
import AskQuestion from "../components/askquestion";
import AddComment from "../components/addcomment";
import CreatePost from "../components/createapost.js";

export default function CreatePostPage() {
  return (
    <Stack spacing={1} component={Container}>
      <Header />
      {/* <AskQuestion /> */}
      {/*  <AddComment /> */}
      <CreatePost />
    </Stack>
  );
}
