import React from "react";
import {
  Box,
  Container,
  Fab,
  Fade,
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

const PostComponent = dynamic(() => import("../components/postcomponent"), {
  ssr: false,
});

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Questions({ post, ssrUser }) {
  return (
    <Container disableGutters>
      <Stack id="headerId" spacing={1}>
        <MobileFab post={post} />
        <Box component={Container}>
          <HeaderApp />
          <HeaderAppOffset />
          {/* // 
      @ts-ignore */}
          <PostComponent />
        </Box>
        <Footer ssrUser={ssrUser} />
      </Stack>
    </Container>
  );
}
