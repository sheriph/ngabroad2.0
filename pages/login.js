import React from "react";
import Login from "../components/login";
import { styled } from "@mui/material/styles";
import { Alert, AlertTitle, Box, Container, Stack } from "@mui/material";
import HeaderApp from "../components/header/headerapp";
import Footer from "../components/footer.js/footer";
import { Authenticator } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function LoginPage() {
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
  ]);

  const router = useRouter();

  console.log("router", router);

  React.useEffect(() => {
    console.log("authStatus", authStatus);
    if (authStatus === "authenticated") {
      console.log("mutating and closing authenticator");
      router.back();
    }
  }, [authStatus]);

  return (
    <Container disableGutters>
      <Stack id="headerId" spacing={1}>
        <Box component={Container}>
          <HeaderApp />
          <HeaderAppOffset />
          <Authenticator
            variation="modal"
            socialProviders={["google", "facebook"]}
          >
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
        </Box>
        <Footer />
      </Stack>
    </Container>
  );
}
