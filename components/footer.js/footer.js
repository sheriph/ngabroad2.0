import React from "react";
import { Box, Dialog, IconButton, Stack, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useRecoilState } from "recoil";
import {
  addComment_,
  addPost_,
  askQuestion_,
  login_,
  replyPost_,
} from "../../lib/recoil";
import AskQuestion from "../askquestion";
import { useTheme } from "@mui/material/styles";
import CreatePost from "../createapost";
import AddComment from "../addcomment";
import ReplyPost from "../replypost";
import Login from "../login";

export default function Footer() {
  const [askQuestion, setAddQuestion] = useRecoilState(askQuestion_);
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const [addComment, setAddComment] = useRecoilState(addComment_);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);
  const [login, setLogin] = useRecoilState(login_);


  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack>
      <Dialog
        sx={{
          "&.MuiModal-root.MuiDialog-root": { zIndex: 1402 },
        }}
        fullScreen={fullScreen}
        open={login}
        onClose={() => setLogin(false)}
      >
        <Login />
      </Dialog>
      <Dialog
        sx={{
          "&.MuiModal-root.MuiDialog-root": { zIndex: 1402 },
        }}
        fullScreen={fullScreen}
        open={askQuestion}
        onClose={() => setAddQuestion(false)}
       // keepMounted={true}
      >
        <AskQuestion />
      </Dialog>
      <Dialog
        sx={{
          "&.MuiModal-root.MuiDialog-root": { zIndex: 1402 },
        }}
        fullScreen={fullScreen}
        open={replyPost}
        onClose={() => setReplyPost(false)}
      >
        <ReplyPost />
      </Dialog>
      <Dialog
        sx={{
          "&.MuiModal-root.MuiDialog-root": { zIndex: 1402 },
        }}
        fullScreen={fullScreen}
        open={addPost}
        onClose={() => setAddPost(false)}
      >
        <CreatePost />
      </Dialog>
      <Dialog
        sx={{
          "&.MuiModal-root.MuiDialog-root": { zIndex: 1402 },
        }}
        fullScreen={fullScreen}
        open={addComment}
        onClose={() => setAddComment(false)}
      >
        <AddComment />
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
