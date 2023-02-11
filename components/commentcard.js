import React from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Grid,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateIcon from "@mui/icons-material/Create";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import {
  getCommentCount,
  getUsername,
  LinkTypography,
  titleCase,
  useAuthUser,
} from "../lib/utility";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { lowerCase, startCase, truncate } from "lodash";
import useSWRImmutable from "swr/immutable";
import dayjs from "dayjs";
import axios from "axios";
import ArticleRender from "./others/articlerender";
import { default as NextLink } from "next/link";
import LazyLoad from "react-lazyload";
import IntroRender from "./others/introrender";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { toast } from "react-toastify";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

// @ts-ignore
export default React.memo(function CommentCard({ comment }) {
  const { data: username } = useSWRImmutable(
    JSON.stringify({
      user_id: comment.user_id,
      tag: "get username from user_id",
    }),
    getUsername
  );

  const { user: userExist } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const { user } = useAuthUser(userExist);

  const getVotes = async (key) => {
    try {
      const { post_id, url } = JSON.parse(key);
      const votes = await axios.post(url, { post_id });
      console.log("votes", votes.data);
      return votes.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const {
    data: votes,
    mutate: mutatevotes,
    error: votesError,
    isValidating: isvalidatingvotes,
  } = useSWRImmutable(
    JSON.stringify({
      url: "/api/others/getvotes",
      tag: "Get votes for a single post",
      post_id: comment._id,
    }),
    getVotes
  );

  const upvotes = votes?.filter((vote) => vote.voteType === "upvote").length;
  const downvotes = votes?.filter(
    (vote) => vote.voteType === "downvote"
  ).length;

  const handleUpVote = async () => {
    if (!votes) return;
    if (!user) {
      toast.error("Please log-in to clap");
      return;
    }
    if (comment.user_id === user._id) {
      toast.error("No self-voting allowed, let others clap for you!");
      return;
    }

    try {
      const newVote = {
        post_id: comment._id,
        user_id: user._id,
        voteType: "upvote",
      };
      await axios.post("/api/others/vote", newVote);
      await mutatevotes();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDownVote = async () => {
    if (!votes) return;
    if (!user) {
      toast.error("Please log-in to clap");
      return;
    }
    if (comment.user_id === user._id) {
      toast.error("No self-voting allowed, let others clap for you!");
      return;
    }

    try {
      const newVote = {
        post_id: comment._id,
        user_id: user._id,
        voteType: "downvote",
      };
      await axios.post("/api/others/vote", newVote);
      await mutatevotes();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <LazyLoad once>
      <Stack direction="row">
        <Stack>
          <Stack>
            <NextLink
              passHref
              href={`/${encodeURIComponent(comment?.post?.slug)}`}
              legacyBehavior
            >
              <Link
                variant="h2"
                textAlign="left"
                sx={{
                  p: 0,
                  justifyContent: "flex-start",
                  textDecorationStyle: "initial",
                  textDecoration: "none",
                }}
                gutterBottom
                underline="hover"
              >
                Re: {titleCase(comment?.post?.title)}
              </Link>
            </NextLink>

            <Stack>
              <IntroRender
                content={truncate(comment.content, {
                  length: 100000,
                  omission: ` ...`,
                })}
              />
            </Stack>

            <Grid
              container
              justifyContent="space-between"
              direction="row"
              sx={{ mt: 1 }}
            >
              <Grid item>
                <Stack alignItems="center" spacing={1} direction="row">
                  <Stack spacing={2} alignItems="center" direction="row">
                    {username ? (
                      <Stack spacing={0.5} alignItems="center" direction="row">
                        <PersonOutlineOutlinedIcon
                          sx={{ fontSize: "1rem" }}
                          fontSize="small"
                        />
                        <NextLink
                          href={`/profile/${encodeURIComponent(username)}`}
                          passHref
                          legacyBehavior
                        >
                          <Link underline="hover" variant="caption">
                            @{username}
                          </Link>
                        </NextLink>
                      </Stack>
                    ) : (
                      <Stack spacing={0.5} alignItems="center" direction="row">
                        <Skeleton sx={{ width: 20, height: 20 }} />
                      </Stack>
                    )}
                    <Stack spacing={0.5} alignItems="center" direction="row">
                      <AccessTimeOutlinedIcon
                        sx={{ fontSize: "1rem" }}
                        fontSize="small"
                      />
                      <Typography variant="caption">
                        {dayjs().to(dayjs(comment.createdAt))}
                      </Typography>
                    </Stack>
                    <ButtonGroup
                      sx={{
                        "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                          border: "none",
                        },
                      }}
                      variant="text"
                    >
                      <Button
                        sx={{ p: 0.5, fontSize: 12, mr: 1 }}
                        startIcon={
                          <ThumbUpAltIcon
                            sx={{ width: 17, height: 17 }}
                            fontSize="small"
                          />
                        }
                        color="inherit"
                        onClick={handleUpVote}
                      >
                        {upvotes}
                      </Button>

                      <Button
                        sx={{ p: 0.5, fontSize: 12, mr: 1 }}
                        startIcon={
                          <ThumbDownIcon
                            sx={{
                              width: 15,
                              height: 15,
                              transform: "rotateY(180deg)",
                            }}
                            fontSize="small"
                          />
                        }
                        color="inherit"
                        onClick={handleDownVote}
                      >
                        {downvotes}
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </LazyLoad>
  );
});
