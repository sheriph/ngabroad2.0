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
import { addPost_, login_, mobileSearchOpen_ } from "../../lib/recoil";
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
  const [login, setLogin] = useRecoilState(login_);
  const { user, isValidating, loading } = useAuthUser();
  const [addPost, setAddPost] = useRecoilState(addPost_);
  const setOpenSearch = useSetRecoilState(mobileSearchOpen_);
  console.log('user', user)

  return (
    <HideOnScroll {...props}>
      <AppBar>
        <Container>
          <SearchMobile />
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }} variant="dense">
            <Stack sx={{ mr: 1 }}>LOGO</Stack>
            <Typography component="div">
              <OtherMenu />
            </Typography>
            <Typography sx={{ mr: "auto" }} component="div">
              <Box
                onClick={() => {
                  if (!user) {
                    toast.error("Please sign-in to post");
                    return;
                  }
                  !props.post && setAddPost(true);
                }}
              >
                <ForumMenu post={props.post} />
              </Box>
            </Typography>

            <SearchIcon
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
            </Box>

            {user ? (
              <AccountMenu user={user} />
            ) : (
              <Box>
                {loading ? (
                  <Skeleton
                    sx={{ bgcolor: "text.disabled" }}
                    width="40px"
                    height="40px"
                    variant="circular"
                  />
                ) : (
                  <Button onClick={() => setLogin(true)} color="inherit">
                    Login
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}
