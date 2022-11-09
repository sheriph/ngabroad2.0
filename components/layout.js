import { Box, Container, Fab, Fade, Stack, Toolbar } from "@mui/material";
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
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PropTypes from "prop-types";

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

ScrollTop.propTypes = {
  // @ts-ignore
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  // @ts-ignore
  window: PropTypes.func,
};

export default function Layout(props) {
  const { children } = props;
  const post = useRecoilValue(post_);
  const [loading, setLoading] = useRecoilState(isLoading_);
  const [blockLoading, setBlockLoading] = useRecoilState(blockLoading_);

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
    <Container  sx={{ px: 0 }} maxWidth="lg">
      <Stack>
        <Loading isAnimating={loading} />
        <BlockingLoading isAnimating={blockLoading} />
        <Box id="back-to-top-anchor">
          <HeaderApp post={post} />
          {/* <Toolbar /> */}
          <Box sx={{ mb: 7 }} />
          {children}
        </Box>
        <ScrollTop {...props}>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
        <Footer />
      </Stack>
    </Container>
  );
}
