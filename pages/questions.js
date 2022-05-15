import { Container, Stack } from "@mui/material";
import Header from "../components/header/header";
import PostComponent from "../components/postcomponent";

export default function Questions() {
  return (
    <Stack spacing={1} component={Container}>
      <Header />
      <PostComponent />
    </Stack>
  );
}
