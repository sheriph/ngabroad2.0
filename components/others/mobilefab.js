import React from "react";
import {
  Box,
  Button,
  Container,
  Fab,
  Snackbar,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  addComment_,
  addPost_,
  askQuestion_,
  postReplyData_,
  replyPost_,
} from "../../lib/recoil";

export default function MobileFab({ post }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [askQuestion, setAddQuestion] = useRecoilState(askQuestion_);
  const [addPost, setAddPost] = useRecoilState(addPost_);
  //  const [addComment, setAddComment] = useRecoilState(addComment_);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);
  const router = useRouter();
  const [openSnack, setOpenSnack] = React.useState(false);
  const [postReplyData, setPostReplyData] = useRecoilState(postReplyData_);

  React.useEffect(() => {
    if (askQuestion || addPost || replyPost) {
      setOpenSnack(false);
    } else {
      setOpenSnack(true);
    }
  }, [askQuestion, addPost, open, replyPost]);

  const actions =
    router.pathname === "/forum"
      ? [
          {
            icon: (
              <Stack
                onClick={() => setAddPost(true)}
                alignItems="center"
                spacing={1}
                direction="row"
              >
                <AssignmentOutlinedIcon color="primary" />{" "}
                <Typography color="black">Create Post</Typography>
              </Stack>
            ),
            name: "Create a Post. Start on new thread",
          },
          {
            icon: (
              <Stack
                onClick={() => setAddQuestion(true)}
                alignItems="center"
                spacing={1}
                direction="row"
              >
                <ContactSupportIcon color="primary" />{" "}
                <Typography color="black">Ask Question</Typography>
              </Stack>
            ),
            name: "Post your question. Start on new thread",
          },
        ]
      : [
          {
            icon: (
              <Stack
                onClick={() => setAddPost(true)}
                alignItems="center"
                spacing={1}
                direction="row"
              >
                <AssignmentOutlinedIcon color="primary" />
                <Typography color="black">Create Post</Typography>
              </Stack>
            ),
            name: "Create a Post. Start on new thread",
          },
          {
            icon: (
              <Stack
                onClick={() => setAddQuestion(true)}
                alignItems="center"
                spacing={1}
                direction="row"
              >
                <ContactSupportIcon color="primary" />
                <Typography color="black">Ask Question</Typography>
              </Stack>
            ),
            name: "Post your question. Start on new thread",
          },
          {
            icon: (
              <Stack
                onClick={() => {
                  setPostReplyData({
                    parentPost_id: post._id,
                    postTitle: post.title,
                    quotedPostContent: "",
                    quotedUser_id: "62fd5507d0b451b394f7dc3a",
                    post: post,
                    isComment: false,
                  });
                  setReplyPost(true);
                }}
                alignItems="center"
                spacing={1}
                direction="row"
              >
                <PostAddOutlinedIcon color="primary" />
                <Typography color="black">Add Comment</Typography>
              </Stack>
            ),
            name: "Comment on this thread",
          },
        ];

  return (
    <Snackbar
      open={openSnack}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={null}
      sx={{ width: "fit-content", left: "auto" }}
    >
      <Box
        sx={{
          "& > :not(style)": { m: 1 },
          display: { xs: "flex", md: "none" },
        }}
      >
        <SpeedDial
          ariaLabel="SpeedDial controlled open example"
          sx={{
            "&.MuiSpeedDial-root": { alignItems: "flex-end" },
            "button.MuiButtonBase-root.MuiFab-root.MuiFab-circular.MuiSpeedDial-fab":
              { width: "40px", height: "40px" },
          }}
          icon={
            open ? (
              <CloseOutlinedIcon fontSize="small" />
            ) : (
              <EditIcon fontSize="small" />
            )
          }
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          color="primary"
        >
          {actions.map((action) => (
            <SpeedDialAction
              hidden={true}
              key={action.name}
              icon={action.icon}
              tooltipTitle={<></>}
              onClick={handleClose}
              tooltipOpen={true}
              color="primary"
              FabProps={{
                variant: "extended",
                color: "primary",
                sx: { textTransform: "none", display: open ? "flex" : "none" },
              }}
              sx={{
                "span#SpeedDialcontrolledopenexample-action-1-label": {
                  display: "none",
                },
                "span#SpeedDialcontrolledopenexample-action-0-label": {
                  display: "none",
                },
                "span#SpeedDialcontrolledopenexample-action-2-label": {
                  display: "none",
                },
              }}
            />
          ))}
        </SpeedDial>
      </Box>
    </Snackbar>
  );
}
