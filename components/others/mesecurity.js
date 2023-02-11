import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import {
  Alert,
  AlertTitle,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { default as NextLink } from "next/link";
import { useRouter } from "next/router";

export default function MeSecurity() {
  const { user, signOut, authStatus } = useAuthenticator((context) => [
    context.user,
  ]);

  const router = useRouter();

  return (
    <Stack>
      <Alert severity="error">
        <AlertTitle>Welcome to the password reset page!</AlertTitle>
        Here you can reset your password if you have forgotten it or need to
        change it. To reset your password, simply click on the "Reset Password"
        button below.
        <br />
        <br /> We advise you to reset your password regularly to ensure the
        security of your account. It is also important to choose a strong and
        unique password that is difficult for others to guess. <br />
        <br />
        If you have any issues or concerns, please feel free to contact our
        support team for assistance.
        <Button
          onClick={async () => {
            signOut();
            await router.push("/login?resetpassword=yes");
          }}
          size="small"
          sx={{ mt: 5 }}
          variant="contained"
        >
          Reset Password
        </Button>
      </Alert>
    </Stack>
  );
}
