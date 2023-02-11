import {
  AppBar,
  Autocomplete,
  Avatar,
  Button,
  Container,
  Dialog,
  Fade,
  IconButton,
  Link,
  Paper,
  Popper,
  Skeleton,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import React from "react";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  addPost_,
  login_,
  mobileSearchOpen_,
  showNewPostDialog_,
} from "../../lib/recoil";
import useSWR from "swr";
import { Auth } from "aws-amplify";
import AccountMenu from "./accountmenu";
import OtherMenu from "./othermenu";
import ForumIcon from "@mui/icons-material/Forum";
import { useAuthUser } from "../../lib/utility";
import ForumMenu from "./forummenu";
import Slide from "@mui/material/Slide";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import SearchMobile from "./searchmobile";
import SearchDesktop from "./searchdesktop";
import { toast } from "react-toastify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import LoginIcon from "@mui/icons-material/Login";
import CustomizedDialogs from "../others/alert";
import NewPostEditor from "../newposteditor";
import { useRouter } from "next/router";

const Transition = React.forwardRef(function Transition(props, ref) {
  // @ts-ignore
  return <Slide direction="down" ref={ref} {...props} />;
});

const PopperMy = function (props) {
  return (
    <Popper {...props} style={{ width: "100%" }} placement="bottom-start" />
  );
};

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    // target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  // window: PropTypes.func,
};

export default function HeaderApp(props) {
  // const { user, isValidating, loading } = useAuthUser();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const router = useRouter();

  const [showNewPostDialog, setShowNewPostDialog] =
    useRecoilState(showNewPostDialog_);
  // console.log("user", user);

  return (
    <HideOnScroll {...props}>
      <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box>
          <SearchMobile />
          <Toolbar component={Container} maxWidth="lg" variant="dense">
            <Stack sx={{ mr: 1 }}>LOGO</Stack>
            <Typography sx={{ flexGrow: 1 }} component="div">
              <OtherMenu />
            </Typography>
            <Typography sx={{ mr: "auto" }} component="div">
              <Button
                startIcon={<ForumIcon />}
                onClick={() => {
                  if (authStatus !== "authenticated") {
                    router.push("/login");
                    return;
                  }
                  setShowNewPostDialog(true);
                }}
                color="inherit"
              >
                Create Post
              </Button>
            </Typography>

            {/* <SearchIcon
              color="inherit"
              sx={{
                mr: 3,
                display: { xs: "block", md: "none" },
                cursor: "pointer",
              }}
              onClick={() => setOpenSearch(true)}
            />

            <Box sx={{ mr: 3, display: { xs: "none", md: "block" } }}>
              <SearchDesktop />
            </Box> */}

            {authStatus === "authenticated" ? (
              <AccountMenu />
            ) : (
              <Button
                startIcon={<LoginIcon />}
                onClick={() => router.push("/login")}
                color="inherit"
              >
                Login
              </Button>
            )}
          </Toolbar>
          <CustomizedDialogs
            open={showNewPostDialog}
            setOpen={setShowNewPostDialog}
            zIndex={1402}
            title="Create a new post"
          >
            <NewPostEditor />
          </CustomizedDialogs>
        </Box>
      </AppBar>
    </HideOnScroll>
  );
}
