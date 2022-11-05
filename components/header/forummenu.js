import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Auth } from "aws-amplify";
import { useSWRConfig } from "swr";
import MenuIcon from "@mui/icons-material/Menu";
import { Autocomplete, Button, Dialog, Stack, TextField } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import { addPost_, login_, postReplyData_, replyPost_ } from "../../lib/recoil";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { useAuthUser } from "../../lib/utility";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function ForumMenu({ post, showMenu }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { mutate } = useSWRConfig();
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const [postReplyData, setPostReplyData] = useRecoilState(postReplyData_);
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);
  // const { user, isValidating, loading } = useAuthUser();
  const { user } = useAuthenticator((context) => [context.authStatus]);

  const [login, setLogin] = useRecoilState(login_);

  const open = Boolean(post && user && showMenu && anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const comment = () => {
    if (!user) {
      setLogin(true);
      return;
    }
    setPostReplyData({
      parentPost: post,
      post: null,
      isComment: false,
    });
    setReplyPost(true);
  };

  /* const mut = await mutate(null, {
          rollbackOnError: false,
          optimisticData: null,
          populateCache: true,
        }); */

  return (
    <React.Fragment>
      <Box>
        <Button
          onClick={handleClick}
          size="small"
          sx={{ mr: 1 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          color="inherit"
          startIcon={<ForumIcon />}
        >
          Add Post
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            if (!user) {
              setLogin(true);
              return;
            }
            setAddPost(true);
          }}
        >
          <Stack spacing={1} direction="row">
            <ForumIcon color="primary" />
            <Typography>Add a New Post</Typography>
          </Stack>
        </MenuItem>

        <MenuItem onClick={comment}>
          <Stack spacing={1} direction="row">
            <ReplyOutlinedIcon color="primary" />
            <Typography>Comment on this post</Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
