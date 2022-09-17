import { Box, Container, Stack } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import HeaderApp from "./header/headerapp";
import Footer from "./footer.js/footer";
import Loading from "./others/loading";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { post_ } from "../lib/recoil";

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Layout({ children }) {
  const post = useRecoilValue(post_);

  return (
    <Container disableGutters>
      <Stack spacing={1}>
        <Loading />
        <Box component={Container}>
          <HeaderApp post={post} />
          <HeaderAppOffset />
          {children}
        </Box>
        <Footer />
      </Stack>
    </Container>
  );
}
