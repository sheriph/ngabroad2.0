import {
  Avatar,
  Divider,
  Link,
  Paper,
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

import dayjs from "dayjs";
import { get, lowerCase, truncate } from "lodash";
import { startCase } from "lodash";
import React from "react";
import useSWR from "swr";
import { useAuthUser } from "../../lib/utility";
import { Box } from "@mui/system";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import useSWRImmutable from "swr/immutable";
import axios from "axios";
import ArticleRender from "./articlerender";
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

const getVotes = async (user_id) => {
  try {
    const key = user_id.split("_")[0];
    const votes = await axios.post("/api/getmyvotes", { user_id: key });
    console.log("votes", votes.data);
    return votes.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getFollows = async (user_id) => {
  try {
    const key = user_id.split("_")[0];
    const follows = await axios.post("/api/getfollows", { user_id: key });
    console.log("follows fetcher", follows.data);
    return follows.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getPosts = async (user_id) => {
  try {
    const key = user_id.split("_")[0];
    const post = await axios.post("/api/getmyposts", { user_id: key });
    console.log("post fetcher", post.data);
    return post.data;
  } catch (error) {
    console.log("error", error);
  }
};

const getComments = async (user_id) => {
  try {
    const key = user_id.split("_")[0];
    const comments = await axios.post("/api/getmycomments", { user_id: key });
    console.log("comments fetcher", comments.data);
    return comments.data;
  } catch (error) {
    console.log("error", error);
  }
};

export default function MeProfile({ ssrUser }) {
  const [tabValue, setTabValue] = React.useState("1");

  const { data: votes } = useSWRImmutable(
    `${ssrUser._id}_allmyvotes`,
    getVotes
  );
  const { data: follows } = useSWRImmutable(
    `${ssrUser?._id}_allmyfollow`,
    getFollows
  );
  const { data: posts } = useSWRImmutable(
    `${ssrUser?._id}_allmyposts`,
    getPosts
  );
  const { data: comments } = useSWRImmutable(
    `${ssrUser?._id}_allmycomments`,
    getComments
  );

  const upvotes = votes ? votes.filter((vote) => vote.status).length : 0;
  const downvotes = votes ? votes.filter((vote) => !vote.status).length : 0;

  console.log("votes follows", posts, comments, upvotes, downvotes);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Stack spacing={3} sx={{ mt: 1 }}>
      <Stack spacing={3} direction="row">
        <Avatar
          alt={ssrUser.username}
          src={ssrUser.image}
          sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 } }}
        />
        <Stack spacing={1}>
          <Typography variant="h1">
            {startCase(lowerCase(`${ssrUser.firstName} ${ssrUser.lastName}`))}
          </Typography>
          <Typography>Travel Consultant</Typography>
          <Typography variant="caption">
            Joined {dayjs(ssrUser.createdAt).format("MMMM YYYY")}
          </Typography>
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
              <ArrowUpwardIcon fontSize="small" />
              <Typography variant="caption">{upvotes}</Typography>
            </Stack>
            <Stack spacing={0.5} alignItems="center" direction="row">
              <ArrowDownwardIcon fontSize="small" />
              <Typography variant="caption">{downvotes}</Typography>
            </Stack>
            <Stack spacing={0.5} alignItems="center" direction="row">
              <BookmarkAddOutlinedIcon fontSize="small" />
              <Typography variant="caption">{follows?.length || 0}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
            >
              <Tab
                sx={{ textTransform: "none" }}
                label={`${
                  (posts || []).filter((post) => post.post_type === "post")
                    .length
                } Posts`}
                value="1"
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={`${
                  (posts || []).filter((post) => post.post_type === "question")
                    .length
                } Questions`}
                value="2"
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={`${(comments || []).length} Comments`}
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Stack
              spacing={2}
              divider={<Divider orientation="horizontal" flexItem />}
            >
              {(posts || [])
                .filter((post) => post.post_type === "post")
                .map((post, key) => (
                  <Stack spacing={1} key={key}>
                    <Typography gutterBottom variant="h1">
                      {startCase(lowerCase(post.title))}
                    </Typography>
                    <ArticleRender
                      content={truncate(post.content, { length: 150 })}
                    />
                    <Link href={`/${post.slug}`}>Read More</Link>
                  </Stack>
                ))}
            </Stack>
          </TabPanel>
          <TabPanel value="2">
            <Stack
              spacing={2}
              divider={<Divider orientation="horizontal" flexItem />}
            >
              {(posts || [])
                .filter((post) => post.post_type === "question")
                .map((post, key) => (
                  <Stack spacing={1} key={key}>
                    <ArticleRender
                      content={truncate(post.content, { length: 150 })}
                    />
                    <Link href={`/${post.slug}`}>Read More</Link>
                  </Stack>
                ))}
            </Stack>
          </TabPanel>
          <TabPanel value="3">
            <Stack
              spacing={2}
              divider={<Divider orientation="horizontal" flexItem />}
            >
              {(comments || []).map((comment, key) => (
                <Stack spacing={1} key={key}>
                  <Typography gutterBottom variant="h1">
                    {startCase(lowerCase(comment.title))}
                  </Typography>
                  <ArticleRender content={comment.content} />
                </Stack>
              ))}
            </Stack>
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}
