import { Alert, AlertTitle, Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useRecoilState, useSetRecoilState } from "recoil";
import { addComment_, isLoading_, login_ } from "../lib/recoil";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Authenticator } from "@aws-amplify/ui-react";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "intersection-observer";
import { useIsVisible } from "react-is-visible";
import { get } from "lodash";

export default function Login() {
  const [login, setLogin] = useRecoilState(login_);

  const formFields = {
    signUp: {
      email: {
        labelHidden: true,
        label: "Email:",
        placeholder: "Enter your Email:",
        isRequired: true,
        order: 1,
      },
      family_name: {
        labelHidden: true,
        label: "Fist Name:",
        placeholder: "Enter your Username:",
        isRequired: true,
        order: 2,
      },
      password: {
        labelHidden: true,
        label: "Password:",
        placeholder: "Enter your Password:",
        isRequired: true,
        order: 3,
      },
    },
  };

  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
  ]);

  const id = "toast-login";

  const { mutate } = useSWRConfig();

  React.useEffect(() => {
    console.log("authStatus", authStatus);
    if (authStatus === "authenticated") {
      console.log("mutating and closing authenticator");
      mutate("/useAuthUser");
      setLogin(false);
    }
  }, [authStatus]);

  return (
    <Stack>
      <Stack
        color="primary"
        sx={{ backgroundColor: "primary.main", py: 1, px: 2 }}
        alignItems="center"
        direction="row"
      >
        <Grid container alignItems="center">
          <Grid item xs></Grid>
          <Grid item xs="auto">
            <Typography color="white" textAlign="center" variant="h1">
              Sign In or Register
            </Typography>
          </Grid>
          <Grid
            sx={{ cursor: "pointer" }}
            onClick={() => setLogin(false)}
            xs
            item
            container
            justifyContent="flex-end"
          >
            <CloseOutlinedIcon sx={{ color: "white" }} />
          </Grid>
        </Grid>
      </Stack>
      <Stack sx={{ p: 2, minHeight: "300px" }} spacing={2}>
        {authStatus !== "authenticated" && (
          <Authenticator socialProviders={["google", "facebook"]}>
            {({ signOut, user }) => {
              return (
                <Box sx={{ minHeight: "400px" }}>
                  <Alert severity="success">
                    <AlertTitle>Welcome Back</AlertTitle>
                    You are now signed-in. You should be redirected in few
                    seconds.
                  </Alert>
                </Box>
              );
            }}
          </Authenticator>
        )}
      </Stack>
    </Stack>
  );
}
