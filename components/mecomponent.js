import {
  Box,
  Divider,
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

export default function MeComponent({ ssrUser }) {
  const [meCategory, setMeCategory] = useRecoilState(meCategory_);
  const { user, loading, error, mutate } = useAuthUser(ssrUser);
  const [value, setValue] = React.useState(0);

  console.log("user in me", user, loading);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        setMeCategory("Account Details");
        break;

      case 1:
        setMeCategory("Edit Profile");
        break;

      case 2:
        setMeCategory("Password and Security");
        break;

      default:
        break;
    }
  };

  return (
    <Stack sx={{ p: { xs: 1, sm: 2 } }} direction="row" spacing={2}>
      <MeSideBar />
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
          <Tabs
            sx={{
              display: { xs: "block", md: "none" },
              textTransform: "none",
            }}
            value={value}
            onChange={handleChange}
            centered
          >
            <Tab sx={{ textTransform: "none" }} label="Account Details" />
            <Tab sx={{ textTransform: "none" }} label="Edit Profile" />
            <Tab sx={{ textTransform: "none" }} label="Password and Security" />
          </Tabs>
          <Stack>
            {meCategory === "Account Details" && (
              <MeProfile ssrUser={ssrUser} />
            )}
          </Stack>
          <Stack>
            {meCategory === "Edit Profile" && (
              <EditProfile ssrUser={ssrUser} alert={false} />
            )}
          </Stack>
          <Stack>
            {meCategory === "Password and Security" && <MeSecurity />}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
