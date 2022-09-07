import React from "react";
import {
  Alert,
  Box,
  Dialog,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { addPost_, login_, replyPost_, updateProfile_ } from "../../lib/recoil";
import { useTheme } from "@mui/material/styles";
import CreatePost from "../createapost";
import ReplyPost from "../replypost";
import Login from "../login";
import EditProfile from "../../components/others/meeditprofile";
import { useAuthUser } from "../../lib/utility";

export default function Footer() {
  const { user } = useAuthUser();
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);
  const [login, setLogin] = useRecoilState(login_);
  const [updateProfile, setUpdateProfile_] = useRecoilState(updateProfile_);
  const [showAlert, setShowAlert] = React.useState(false);

  console.log("user footer", user);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    if (
      user &&
      Boolean(!user?.firstName || !user?.lastName || !user?.username)
    ) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [user?.firstName, user?.lastName, user?.username]);

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
        open={showAlert}
      >
        <Stack spacing={1} sx={{ p: 2 }}>
          <Alert severity="success">
            We are happy to welcome you as a new member of this community.
            Please complete your profile to start using your account.
          </Alert>
          <EditProfile alert={true} />
        </Stack>
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
    </Stack>
  );
}
