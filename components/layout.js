import { Box, Container, Stack, Toolbar } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import HeaderApp from "./header/headerapp";
import Footer from "./footer.js/footer";
import Loading from "./others/loading";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { blockLoading_, isLoading_, post_ } from "../lib/recoil";
import { useAuthUser } from "../lib/utility";
import Router from "next/router";
import BlockingLoading from "./others/blockingloading";

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Layout({ children }) {
  const post = useRecoilValue(post_);
  const [loading, setLoading] = useRecoilState(isLoading_);
  const [blockLoading, setBlockLoading] = useRecoilState(blockLoading_);
  const { isValidating, loading: loadingUser } = useAuthUser();

  React.useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      console.log("routeChangeStart");
      setBlockLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      console.log("routeChangeComplete");
      setBlockLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setBlockLoading(false);
    });
  }, [Router]);

  return (
    <Container>
      <Stack>
        <Loading isAnimating={loading} />
        <BlockingLoading isAnimating={blockLoading} />
        <Box>
          <HeaderApp post={post} />
          {/* <Toolbar /> */}
          <Box sx={{ mb: 7 }} />
          {children}
        </Box>
        <Footer />
      </Stack>
    </Container>
  );
}
