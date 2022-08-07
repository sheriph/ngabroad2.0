import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Footer from "../components/footer.js/footer";
import Header from "../components/header/header";
import dynamic from "next/dynamic";

const PostComponentNossr = dynamic(
  () => import("../components/postcomponent"),
  {
    ssr: false,
    
  }
);

export default function Questions() {
  return (
    <Stack spacing={1}>
      <Box component={Container}>
        <Header />
        <PostComponentNossr />
      </Box>
      <Footer />
    </Stack>
  );
}
