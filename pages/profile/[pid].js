import React from "react";
import {
  Box,
  Container,
  Fab,
  Fade,
  LinearProgress,
  Stack,
  useScrollTrigger,
} from "@mui/material";
import Loading from "../../components/others/loading";
import HeaderApp from "../../components/header/headerapp";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Footer from "../../components/footer.js/footer";
import Amplify, { withSSRContext } from "aws-amplify";
import getUser from "../../lib/mongodb/getuser";

/* Auth.configure({
  ...config,
  ssr: true,
}); */

const MeComponent = dynamic(() => import("../../components/mecomponent"), {
  ssr: false,
});

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Me({ ssrUser }) {
  return (
    <Container disableGutters>
      <Loading />
      <Stack id="headerId" spacing={1}>
        <Box component={Container}>
          <HeaderApp ssrUser={ssrUser} />
          <HeaderAppOffset />
          {/* // 
      @ts-ignore */}
          <MeComponent ssrUser={ssrUser} />
        </Box>
        <Footer ssrUser={ssrUser} />
      </Stack>
    </Container>
  );
}

export async function getServerSideProps({ params, req }) {
  try {
    // console.log("req", req);
    //  const { Auth } = withSSRContext({ req });
    //  const authUser = await Auth.currentAuthenticatedUser();
    const username = params.pid;
    const user = await getUser(username);
    const ssrUser = user ? JSON.parse(user) : undefined;
    console.log("ssrUser", ssrUser);
    if (!ssrUser) throw new Error("user not found");
    return { props: { ssrUser } };
  } catch (err) {
    console.log(err);
    if (err === "The user is not authenticated") {
      return {
        redirect: {
          destination: `/login/?url=account/${params.pid}`,
          permanent: false,
        },
      };
    }
    return {
      notFound: true,
    };
  }
}
