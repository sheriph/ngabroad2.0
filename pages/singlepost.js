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

const SinglePostComponent = dynamic(
  () => import("../components/others/singlepostcomponent"),
  { ssr: false }
);

export default function Questions() {
  return (
    <Stack spacing={1}>
      <Box component={Container}>
        <Header />
        {/* // 
        @ts-ignore */}
        <SinglePostComponent />
        <MobileFab />
      </Box>
      <Footer />
    </Stack>
  );
}
