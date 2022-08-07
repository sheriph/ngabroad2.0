import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Footer from "../components/footer.js/footer";
import Header from "../components/header/header";
import SinglePostComponent from "../components/others/singlepostcomponent";

export default function Questions() {
  return (
    <Stack spacing={1}>
      <Box component={Container}>
        <Header />
        <SinglePostComponent />
      </Box>
      <Footer />
    </Stack>
  );
}
