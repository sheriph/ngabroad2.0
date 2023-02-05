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
import {
  addPost_,
  editPostDialog_,
  login_,
  replyPost_,
  showNewPostDialog_,
  updateProfile_,
} from "../../lib/recoil";
import { useTheme } from "@mui/material/styles";
import CreatePost from "../createapost";
import ReplyPost from "../replypost";
import Login from "../login";
import EditProfile from "../../components/others/meeditprofile";
import { useAuthUser } from "../../lib/utility";
import { useAuthenticator } from "@aws-amplify/ui-react";
import NewPostEditor from "../newposteditor";
import CustomizedDialogs from "../others/alert";
import ModifyPostEditor from "../modifyposteditor";

export default function Footer() {
  const { user: userExist } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  // console.log("userExist", userExist);
  const { user } = useAuthUser(userExist);
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);
  const [login, setLogin] = useRecoilState(login_);
  const [updateProfile, setUpdateProfile_] = useRecoilState(updateProfile_);
  const [showAlert, setShowAlert] = React.useState(false);
  const [editPostDialog, setEditPostDialog] = useRecoilState(editPostDialog_);

  console.log("user footer", user?.email);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    if (user && Boolean(!user?.username)) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [user?.email]);

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

      <CustomizedDialogs
        open={editPostDialog}
        setOpen={setEditPostDialog}
        zIndex={1402}
        title="Edit Post"
      >
        <ModifyPostEditor />
      </CustomizedDialogs>
      <CustomizedDialogs
        open={showAlert}
        setOpen={setShowAlert}
        zIndex={1402}
        title="Incomplete Profile"
      >
        <EditProfile />
      </CustomizedDialogs>
    </Stack>
  );
}
