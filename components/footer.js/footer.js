import React from "react";
import { Box, Dialog, IconButton, Stack, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { addComment_, addPost_, askQuestion_ } from "../../lib/recoil";
import AskQuestion from "../askquestion";
import { useTheme } from "@mui/material/styles";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CreatePost from "../createapost";
import AddComment from "../addcomment";

export default function Footer() {
  const [askQuestion, setAddQuestion] = useRecoilState(askQuestion_);
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const [addComment, setAddComment] = useRecoilState(addComment_);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack>
      <Dialog
        fullScreen={fullScreen}
        open={askQuestion}
        onClose={() => setAddQuestion(false)}
      >
        <Stack spacing={3} justifyContent="center">
          <AskQuestion />
          <IconButton
            onClick={() => setAddQuestion(false)}
            disableRipple={true}
            disableTouchRipple={true}
            color="primary"
            size="large"
          >
            <CancelIcon fontSize="large" />
          </IconButton>
        </Stack>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={addPost}
        onClose={() => setAddPost(false)}
      >
        <Stack spacing={3} justifyContent="center">
          <CreatePost />
          <IconButton
            onClick={() => setAddPost(false)}
            disableRipple={true}
            disableTouchRipple={true}
            color="primary"
            size="large"
          >
            <CancelIcon fontSize="large" />
          </IconButton>
        </Stack>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={addComment}
        onClose={() => setAddComment(false)}
      >
        <Stack spacing={3} justifyContent="center">
          <AddComment />
          <IconButton
            onClick={() => setAddComment(false)}
            disableRipple={true}
            disableTouchRipple={true}
            color="primary"
            size="large"
          >
            <CancelIcon fontSize="large" />
          </IconButton>
        </Stack>
      </Dialog>

      {/* <Box>
        <Image
          src="/images/base/footerdesktop1080.jpeg"
          alt="desktop footer"
          width="100%"
          height="80%"
        />
      </Box> */}
    </Stack>
  );
}
