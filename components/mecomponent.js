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
import { TabContext, TabList, TabPanel } from "@mui/lab";

const profileUserFetcher = async (key) => {
  try {
    const { username } = JSON.parse(key);
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

  const { data: profileUser } = useSWRImmutable(
    username
      ? JSON.stringify({ username, tag: "get user data for profile" })
      : undefined,
    profileUserFetcher
  );

  const mobile = useMediaQuery("(max-width:600px)", { noSsr: true });

  const [tabValue, setValue] = React.useState("1");

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!profileUser) return <Skeleton sx={{ height: "500px", width: "100%" }} />;

  console.log("profileUser", profileUser);

  return (
    <Stack>
      <TabContext value={tabValue}>
        <Box
          sx={{
            borderBottom: profileUser?._id === user?._id ? 1 : 0,
            borderColor: "divider",
          }}
        >
          {profileUser?._id === user?._id && (
            <TabList centered allowScrollButtonsMobile onChange={handleTabChange}>
              <Tab
                sx={{ textTransform: "none" }}
                label={mobile ? "" : "Account Details"}
                value="1"
                icon={mobile ? <ContactMailOutlinedIcon /> : ""}
                iconPosition="start"
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={mobile ? "" : "Edit Profile"}
                value="2"
                icon={mobile ? <ContactMailOutlinedIcon /> : ""}
                iconPosition="start"
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={mobile ? "" : "Security"}
                value="3"
                icon={mobile ? <VpnKeyOutlinedIcon /> : ""}
              />
            </TabList>
          )}
        </Box>
        <TabPanel value="1">
          <MeProfile profileUser={profileUser} />
        </TabPanel>
        <TabPanel value="2">
          <EditProfile />
        </TabPanel>
        <TabPanel value="3">
          <MeSecurity />
        </TabPanel>
      </TabContext>
    </Stack>
  );
}
