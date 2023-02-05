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
import { Button } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { editPostDialog_, showNewPostDialog_ } from "../lib/recoil";

export default function Index() {
  const setShowNewPostDialog = useSetRecoilState(showNewPostDialog_);
  const setEditPostDialog = useSetRecoilState(editPostDialog_);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Next.js example
      </Typography>

      <Button onClick={() => setShowNewPostDialog(true)}>Create Post</Button>
      <Button onClick={() => setEditPostDialog(true)}>Edit Post</Button>
    </Box>
  );
}
