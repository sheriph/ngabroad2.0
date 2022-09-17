import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProTip from "../src/ProTip";
import Link from "../src/Link";
import Copyright from "../src/Copyright";
import Header from "../components/header/header";
import HeaderApp from "../components/header/headerapp";
import { styled } from "@mui/material/styles";

const HeaderAppOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Index() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Next.js example
      </Typography>
      {/* 
    // @ts-ignore */}
      <Link href="/about" color="secondary">
        Go to the about page
      </Link>
      <ProTip />
      <Copyright />
    </Box>
  );
}
