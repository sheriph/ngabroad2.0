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
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";

/* const Layout = dynamic(() => import("../components/layout"), {
  ssr: false,
}); */

Amplify.configure({
  ...config,
  ssr: true,
});
Auth.configure({
  ...config,
  ssr: true,
});

const localStorage =
  typeof window !== `undefined` ? window.localStorage : undefined;

function localStorageProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(
    JSON.parse(localStorage?.getItem("swr-custom-cache") || "[]")
  );

  // Before unloading the app, we write back all the data into `localStorage`.
  typeof window !== `undefined` &&
    window.addEventListener("beforeunload", () => {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage?.setItem("swr-custom-cache", appCache);
    });

  // We still use the map for write & read for performance.
  return map;
}

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
        <SWRConfig value={{ provider: localStorageProvider }}>
          <RecoilRoot>
            <Authenticator.Provider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Authenticator.Provider>
          </RecoilRoot>
        </SWRConfig>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
