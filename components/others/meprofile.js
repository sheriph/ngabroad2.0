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

import dayjs from "dayjs";

import React from "react";
import { HtmlTooltip, titleCase, useAuthUser } from "../../lib/utility";
import { Box } from "@mui/system";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import useSWR from "swr";

import useSWRImmutable from "swr/immutable";
import axios from "axios";

import ProfilePosts from "./profileposts";
import ProfileQuestions from "./profilequestions";
import ProfileComments from "./profilecomments";

const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

const getVotes = async (user_id) => {
  try {
    const key = user_id.split("_")[0];
    const votes = await axios.post("/api/others/getmyvotes", { user_id: key });
    console.log("votes", votes.data);
    return votes.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getFollows = async (user_id) => {
  try {
    const key = user_id.split("_")[0];
    const follows = await axios.post("/api/others/getfollows", {
      user_id: key,
    });
    console.log("follows fetcher", follows.data);
    return follows.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getPostsCount = async (key) => {
  try {
    const follows = await axios.post("/api/others/getusercontentscount", {
      key,
    });
    console.log("postsCount fetcher", follows.data);
    return follows.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getCommentsCount = async (key) => {
  const user_id = key.split("-")[0];
  try {
    const follows = await axios.post("/api/others/getusercommentscount", {
      user_id,
    });
    console.log("commentsCount fetcher", follows.data);
    return follows.data;
  } catch (error) {
    console.log("error", error);
  }
};

export default function MeProfile({ profileUser }) {
  const [tabValue, setTabValue] = React.useState("1");

  const { data: votes } = useSWRImmutable(
    profileUser?._id ? `${profileUser?._id}_allmyvotes` : undefined,
    getVotes
  );
  const { data: follows } = useSWRImmutable(
    profileUser?._id ? `${profileUser?._id}_allmyfollow` : undefined,
    getFollows
  );

  const { data: postsCount } = useSWRImmutable(
    profileUser?._id ? `post-${profileUser?._id}-allmyposts` : undefined,
    getPostsCount
  );

  const { data: questionsCount } = useSWRImmutable(
    profileUser?._id ? `question-${profileUser?._id}-allmyposts` : undefined,
    getPostsCount
  );

  const { data: commentsCount } = useSWRImmutable(
    profileUser?._id ? `${profileUser?._id}-allmycomments` : undefined,
    getCommentsCount
  );

  const upvotes = votes ? votes.filter((vote) => vote.status).length : 0;
  const downvotes = votes ? votes.filter((vote) => !vote.status).length : 0;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log("follows", follows);

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Stack justifyContent="center" spacing={3} direction="row">
        <Avatar
          alt={profileUser?.username}
          src={profileUser?.image}
          sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 } }}
        />
        <Stack spacing={1}>
          <Stack spacing={1} direction="row">
            <Typography variant="h1">
              {titleCase(`${profileUser?.firstName} ${profileUser?.lastName}`)}
            </Typography>
            <Link href={`/profile/${profileUser.username}`} variant="caption">
              @{profileUser.username}
            </Link>
          </Stack>
          <Typography variant="caption">
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
                      Number of times {titleCase(`${profileUser.firstName}`)}{" "}
                      was upvoted
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
                      Number of times {titleCase(`${profileUser.firstName}`)}{" "}
                      was downvoted
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" spacing={1} direction="row">
                    <NotificationsActiveIcon
                      sx={{ width: 17, height: 17 }}
                      fontSize="small"
                    />
                    <Typography variant="caption">
                      Number of posts {titleCase(`${profileUser.firstName}`)} is
                      following
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
                  sx={{ width: 17, height: 17 }}
                  fontSize="small"
                />
                <Typography variant="caption">{upvotes}</Typography>
              </Stack>
              <Stack spacing={0.5} alignItems="center" direction="row">
                <ThumbDownIcon
                  sx={{ width: 15, height: 15, transform: "rotateY(180deg)" }}
                  fontSize="small"
                />
                <Typography variant="caption">{downvotes}</Typography>
              </Stack>
              <Stack spacing={0.5} alignItems="center" direction="row">
                <NotificationsActiveIcon
                  sx={{ width: 17, height: 17 }}
                  fontSize="small"
                />
                <Typography variant="caption">{follows || 0}</Typography>
              </Stack>
            </Stack>
          </HtmlTooltip>
        </Stack>
      </Stack>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleTabChange}>
              <Tab
                sx={{ textTransform: "none" }}
                label={`${postsCount} Posts`}
                value="1"
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={`${questionsCount} Questions`}
                value="2"
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={`${commentsCount} Comments`}
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel sx={{ "&.MuiTabPanel-root": { py: 2, px: 0 } }} value="1">
            <ProfilePosts postsCount={postsCount} id={profileUser._id} />
          </TabPanel>
          <TabPanel sx={{ "&.MuiTabPanel-root": { py: 2, px: 0 } }} value="2">
            <ProfileQuestions
              questionsCount={questionsCount}
              id={profileUser._id}
            />
          </TabPanel>
          <TabPanel sx={{ "&.MuiTabPanel-root": { py: 2, px: 0 } }} value="3">
            <ProfileComments
              commentsCount={commentsCount}
              id={profileUser._id}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}
