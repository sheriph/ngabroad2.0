import { Container, Stack, TextField } from "@mui/material";
import CreatePostComponent from "../components/createpost";
import Header from "../components/header/header";

export default function CreatePostPage() {
  return (
    <Stack spacing={1} component={Container}>
      <Header />
      <CreatePostComponent />
    </Stack>
  );
}
