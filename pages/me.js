import React from "react";
import {
  Box,
  Container,
  Fab,
  Fade,
  LinearProgress,
  Stack,
  useScrollTrigger,
} from "@mui/material";
import Footer from "../components/footer.js/footer";
import Header from "../components/header/header";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import MobileFab from "../components/others/mobilefab";
import HeaderApp from "../components/header/headerapp";
import PropTypes from "prop-types";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRecoilValue } from "recoil";
import { isLoading_ } from "../lib/recoil";
import Loading from "../components/others/loading";

const MeComponent = dynamic(() => import("../components/mecomponent"), {
  ssr: false,
});

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Me(props) {
  return (
    <Container disableGutters>
      <Loading />
      <Stack id="headerId" spacing={1}>
        <Box component={Container}>
          <HeaderApp />
          <HeaderAppOffset />
          {/* // 
      @ts-ignore */}
          <MeComponent />
        </Box>
        <Footer />
      </Stack>
    </Container>
  );
}
