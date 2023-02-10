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
import { blockLoading_, meCategory_ } from "../../lib/recoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useAuthUser } from "../../lib/utility";

const userFetcher = async () => {
  try {
    console.log("geting authed user");
    const user = await axios.get("/api/others/getuserdata");
    console.log("user", user.data);
    return user.data;
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [meCtegory, setMeCategory] = useRecoilState(meCategory_);
  const setBlockLoading = useSetRecoilState(blockLoading_);

  const router = useRouter();

  const { user: userExist } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const { user, isLoading, mutate } = useAuthUser(userExist);

  React.useEffect(() => {
    if (isLoading) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = async () => {
    try {
      console.log("signing out authed user");
      const user = await Auth.signOut();
      mutate(null, {
        optimisticData: null,
        populateCache: true,
        revalidate: true,
      });
      console.log("auth user", user);
    } catch (error) {
      console.log("error", error);
      throw new Error(error);
    }
  };

  return (
    <React.Fragment>
      <Box>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{}}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt="profile image"
              src={user?.image}
            />
          </IconButton>
        </Tooltip>
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
            setMeCategory("Account Details");
            router.push(`profile/${user?.username}`);
          }}
        >
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setMeCategory("Edit Profile");
            console.log("go to settings");
            router.push(`profile/${user?.username}`);
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
