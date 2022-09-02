import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Loading from "../../components/others/loading";
import HeaderApp from "../../components/header/headerapp";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Footer from "../../components/footer.js/footer";
import getUser from "../../lib/mongodb/getuser";

const UserProfile = dynamic(
  () => import("../../components/others/userprofile"),
  {
    ssr: false,
  }
);

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
          <UserProfile ssrUser={ssrUser} />
        </Box>
        <Footer ssrUser={ssrUser} />
      </Stack>
    </Container>
  );
}

export async function getServerSideProps({ params, req }) {
  try {
    console.log("req", req);
    const username = params.pid;
    const user = await getUser(null, username);
    const ssrUser = user ? JSON.parse(user) : undefined;
    console.log("ssrUser", ssrUser);
    if (!ssrUser) throw new Error("user not found");
    return { props: { ssrUser } };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
}
