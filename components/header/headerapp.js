import {
  AppBar,
  Avatar,
  Button,
  Container,
  Fade,
  IconButton,
  Link,
  Skeleton,
  Slide,
  Stack,
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
import { useRecoilState } from "recoil";
import { login_ } from "../../lib/recoil";
import useSWR from "swr";
import { Auth } from "aws-amplify";
import { userFetcher } from "../../lib/utility";
import AccountMenu from "./accountmenu";
import OtherMenu from "./othermenu";
import ForumIcon from "@mui/icons-material/Forum";

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

  const { data: user, mutate, error } = useSWR("/useAuthUser", userFetcher, {});
  const loading = !user && !error;


  return (
    <HideOnScroll {...props}>
      <AppBar>
        <Container>
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }} variant="dense">
            <Stack sx={{ mr: 1 }}>LOGO</Stack>
            <Typography component="div">
              <OtherMenu />
            </Typography>
            <Typography sx={{ flexGrow: 1 }} component="div">
              <Tooltip title="Travel Gist Forum">
                <Button
                  size="small"
                  sx={{ mr: 1 }}
                  color="inherit"
                  startIcon={<ForumIcon />}
                >
                  Forum
                </Button>
              </Tooltip>
            </Typography>
            {user ? (
              <AccountMenu />
            ) : (
              <Box>
                {loading ? (
                  <Skeleton width="40px" height="40px" variant="circular" />
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
