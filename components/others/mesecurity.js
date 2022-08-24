import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Button, Stack, Typography } from "@mui/material";
import React from "react";

export default function MeSecurity() {
  const { user, signOut, authStatus } = useAuthenticator((context) => [
    context.user,
  ]);

  return (
    <Stack>
      <Typography gutterBottom variant="h1">
        How to change your password
      </Typography>
      <Typography>
        To change your passpord, please follow this simple steps:
      </Typography>
      <ul>
        <li>Sign out first</li>
        <li>Click sign in again</li>
        <li>Click forget password and follow the on screen instruction</li>
      </ul>
    </Stack>
  );
}
