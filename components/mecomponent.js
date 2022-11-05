import {
  Box,
  Divider,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DesktopSideBar from "./others/desktopsidebar";
import React from "react";
import MeSideBar from "./others/mesidebar";
import { useRecoilState, useRecoilValue } from "recoil";
import { meCategory_ } from "../lib/recoil";
import MeProfile from "./others/meprofile";
import EditProfile from "./others/meeditprofile";
import MeSecurity from "./others/mesecurity";
import useSWR from "swr";
import { useAuthUser } from "../lib/utility";
import PortraitIcon from "@mui/icons-material/Portrait";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import { get } from "lodash";
import useSWRImmutable from "swr/immutable";
import axios from "axios";

const profileUserFetcher = async (key) => {
  try {
    const username = key.split("-")[0];
    const user = await axios.post("/api/others/getuserwithusername", {
      username,
    });
    console.log("user", user.data);
    return user.data;
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};

export default function MeComponent() {
  const [meCategory, setMeCategory] = useRecoilState(meCategory_);
  const router = useRouter();
  const username = get(router, "query.pid", "");
  const { user: userExist } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const { user, isLoading, mutate } = useAuthUser(userExist);

  const {
    data: profileUser,
    mutate: profileUserMutate,
    error: profileUserError,
    isValidating: profileUserIsValidating,
    isLoading: profileUserIsLoading,
  } = useSWRImmutable(
    username ? `${username}-getuserdetail` : undefined,
    profileUserFetcher
  );

  const mobile = useMediaQuery("(max-width:600px)", { noSsr: true });

  //console.log("user in me", username, user, profileUser);

  /*   React.useEffect(() => {
    if (!isLoading && ssrUser._id !== user?._id) {
      setMeCategory("Account Details");
    }
  }, [ssrUser._id === user?._id]); */

  if (!profileUser) return <Skeleton sx={{ height: "500px", width: "100%" }} />;

  console.log('profileUser', profileUser)

  return (
    <Stack sx={{ p: { xs: 1, sm: 2 } }} direction="row" spacing={2}>
      <MeSideBar profileUser={profileUser} />
      <Divider
        sx={{
          position: "relative",
          left: "250px",
          margin: `0 !important`,
          display: { xs: "none", md: "block" },
        }}
        orientation="vertical"
        flexItem
      />
      <Box
        sx={{
          position: { xs: "inherit", md: "relative" },
          left: { xs: 0, md: "250px" },
          width: { xs: "100%", md: "calc(100% - 270px)" },
          marginLeft: { xs: `0 !important`, md: `16px !important` },
        }}
      >
        <Stack spacing={1}>
          {profileUser?._id === user?._id ? (
            <Tabs
              scrollButtons={true}
              sx={{
                display: { xs: "block", md: "none" },
                textTransform: "none",
              }}
              allowScrollButtonsMobile
              value={meCategory}
              onChange={(e, value) => setMeCategory(value)}
              centered
            >
              <Tab
                icon={mobile ? <ContactMailOutlinedIcon /> : ""}
                iconPosition="start"
                sx={{ textTransform: "none" }}
                label={mobile ? "" : "Account Details"}
                value="Account Details"
              />
              <Tab
                icon={mobile ? <EditOutlinedIcon /> : ""}
                sx={{ textTransform: "none" }}
                label={mobile ? "" : "Edit Profile"}
                value="Edit Profile"
              />
              <Tab
                icon={mobile ? <VpnKeyOutlinedIcon /> : ""}
                sx={{ textTransform: "none" }}
                label={mobile ? "" : "Security"}
                value="Password and Security"
              />
            </Tabs>
          ) : (
            ""
          )}
          <Stack>
            {meCategory === "Account Details" ? (
              <MeProfile profileUser={profileUser} />
            ) : (
              ""
            )}
          </Stack>
          <Stack>{meCategory === "Edit Profile" ? <EditProfile /> : ""}</Stack>
          <Stack>
            {meCategory === "Password and Security" ? <MeSecurity /> : ""}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
