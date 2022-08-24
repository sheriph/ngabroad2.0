import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DesktopSideBar from "./others/desktopsidebar";
import React from "react";
import MeSideBar from "./others/mesidebar";
import { useRecoilValue } from "recoil";
import { meCategory_ } from "../lib/recoil";
import MeProfile from "./others/meprofile";
import EditProfile from "./others/meeditprofile";
import MeSecurity from "./others/mesecurity";
import { useAuthUser } from "../lib/utility";

export default function MeComponent(props, context) {
  const meCategory = useRecoilValue(meCategory_);
  const { user, loading, error, mutate } = useAuthUser();

  if (!user) {
    return <Stack></Stack>;
  }

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
        <Stack>{meCategory === "Account Details" && <MeProfile />}</Stack>
        <Stack>{meCategory === "Edit Profile" && <EditProfile />}</Stack>
        <Stack>
          {meCategory === "Password and Security" && <MeSecurity />}
        </Stack>
      </Box>
    </Stack>
  );
}
