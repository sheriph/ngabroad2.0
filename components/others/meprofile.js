import {
  Avatar,
  Button,
  Divider,
  Link,
  Paper,
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
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CommentComponent from "./commentcomments";

import dayjs from "dayjs";

import React from "react";
import { HtmlTooltip, titleCase, useAuthUser } from "../../lib/utility";
import { Box } from "@mui/system";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import useSWR from "swr";

import useSWRImmutable from "swr/immutable";
import axios from "axios";

import ProfileQuestions from "./profilequestions";
import ProfileComments from "./commentcomments";
import dynamic from "next/dynamic";

const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

const PostComponent = dynamic(() => import("../../components/postcomponent"), {
  ssr: false,
});

const getMyUpVotes = async (key) => {
  try {
    const { user_id } = JSON.parse(key);
    const upvotes = await axios.post("/api/others/getmyupvotes", { user_id });
    console.log("upvotes", upvotes.data);
    return upvotes.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getMyDownVotes = async (key) => {
  try {
    const { user_id } = JSON.parse(key);
    const upvotes = await axios.post("/api/others/getmydownvotes", { user_id });
    console.log("upvotes", upvotes.data);
    return upvotes.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getPostsCount = async (key) => {
  try {
    const { user_id } = JSON.parse(key);
    const posts = await axios.post("/api/others/getuserpostscount", {
      user_id,
    });
    console.log("postsCount fetcher", posts.data);
    return posts.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getCommentsCount = async (key) => {
  try {
    const { user_id } = JSON.parse(key);
    const comments = await axios.post("/api/others/getusercommentscount", {
      user_id,
    });
    console.log("commentsCount fetcher", comments.data);
    return comments.data;
  } catch (error) {
    console.log("error", error);
  }
};

export default function MeProfile({ profileUser }) {
  const [tabValue, setTabValue] = React.useState("1");

  const { data: upvotes } = useSWRImmutable(
    profileUser?._id
      ? JSON.stringify({
          user_id: profileUser?._id,
          tag: "get user upvotes count",
        })
      : undefined,
    getMyUpVotes
  );
  const { data: downvotes } = useSWRImmutable(
    profileUser?._id
      ? JSON.stringify({
          user_id: profileUser?._id,
          tag: "get user downvotes count",
        })
      : undefined,
    getMyDownVotes
  );

  const { data: postsCount } = useSWRImmutable(
    profileUser?._id
      ? JSON.stringify({
          user_id: profileUser?._id,
          tag: "get user posts count",
        })
      : undefined,
    getPostsCount
  );

  const { data: commentsCount } = useSWRImmutable(
    profileUser?._id
      ? JSON.stringify({
          user_id: profileUser?._id,
          tag: "get user comments count",
        })
      : undefined,
    getCommentsCount
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Stack justifyContent="center" spacing={1.5} direction="row">
        <Avatar
          alt={profileUser?.username}
          src={profileUser?.image}
          sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 } }}
        />
        <Stack spacing={0.5}>
          <Stack direction="row">
            <Typography sx={{ pr: 1 }} textAlign="left" variant="h2">
              {titleCase(`${profileUser?.firstName} ${profileUser?.lastName}`)}
            </Typography>
            <Link textAlign="left" href={`/profile/${profileUser.username}`}>
              @{profileUser.username}
            </Link>
          </Stack>
          <Typography textAlign="left">
            Joined {dayjs(profileUser.createdAt).format("MMMM YYYY")}
          </Typography>
          <HtmlTooltip
            arrow
            title={
              <React.Fragment>
                <Stack spacing={1}>
                  <Stack alignItems="center" spacing={1} direction="row">
                    <ThumbUpAltIcon
                      sx={{ width: 17, height: 17 }}
                      fontSize="small"
                    />
                    <Typography variant="caption">
                      Number of times upvoted
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" spacing={1} direction="row">
                    <ThumbDownIcon
                      sx={{
                        width: 15,
                        height: 15,
                        transform: "rotateY(180deg)",
                      }}
                      fontSize="small"
                    />
                    <Typography variant="caption">
                      Number of times downvoted
                    </Typography>
                  </Stack>
                </Stack>
              </React.Fragment>
            }
          >
            <Stack
              divider={<Divider orientation="vertical" flexItem />}
              component={Paper}
              variant="outlined"
              direction="row"
              spacing={1}
              sx={{
                width: "fit-content",
                px: 1,
                backgroundColor: "background.default",
              }}
            >
              <Stack spacing={0.5} alignItems="center" direction="row">
                <ThumbUpAltIcon
                  sx={{ width: 20, height: 20 }}
                  fontSize="small"
                />
                <Typography>{upvotes}</Typography>
              </Stack>
              <Stack spacing={0.5} alignItems="center" direction="row">
                <ThumbDownIcon
                  sx={{ width: 20, height: 20, transform: "rotateY(180deg)" }}
                  fontSize="small"
                />
                <Typography>{downvotes}</Typography>
              </Stack>
            </Stack>
          </HtmlTooltip>
        </Stack>
      </Stack>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList centered onChange={handleTabChange}>
              <Tab
                sx={{ textTransform: "none" }}
                label={`${postsCount} Posts`}
                value="1"
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={`${commentsCount} Comments`}
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel sx={{ "&.MuiTabPanel-root": { py: 2, px: 0 } }} value="1">
            {/* // 
          @ts-ignore */}
            <PostComponent user_id={profileUser._id} />
          </TabPanel>
          <TabPanel sx={{ "&.MuiTabPanel-root": { py: 2, px: 0 } }} value="2">
            <CommentComponent
              // @ts-ignore
              user_id={profileUser._id}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}
