import { Box, Container, Stack } from "@mui/material";
import Footer from "../components/footer.js/footer";
import Header from "../components/header/header";
import PostComponent from "../components/postcomponent";

export default function Questions() {
  return (
    <Stack spacing={1}>
      <Box component={Container}>
        <Header />
        <PostComponent />
      </Box>
      <Footer />
    </Stack>
  );
}
