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

const SinglePostComponent = dynamic(
  () => import("../components/others/singlepostcomponent"),
  { ssr: false }
);

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);


export default function Questions() {
  return (
    <Stack spacing={1}>
      <Box component={Container}>
        <HeaderApp />
        <HeaderAppOffset />
        {/* // 
        @ts-ignore */}
        <SinglePostComponent />
        <MobileFab />
      </Box>
      <Footer />
    </Stack>
  );
}
