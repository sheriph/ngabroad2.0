// @ts-ignore
import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import "react-toastify/dist/ReactToastify.css";
import Amplify, { Auth } from "aws-amplify";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/global.css";


import config from "../src/aws-exports";
import Layout from "../components/layout";

Amplify.configure({
  ...config,
  ssr: true,
});
Auth.configure({
  ...config,
  ssr: true,
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <ToastContainer />
        <CssBaseline />
        <RecoilRoot>
          <Authenticator.Provider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Authenticator.Provider>
        </RecoilRoot>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
