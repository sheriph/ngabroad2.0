import React from "react";
import { Avatar, Button, Grid, Link, Stack, Typography } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateIcon from "@mui/icons-material/Create";
import { getUsername, LinkTypography } from "../lib/utility";
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

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const getCommentCount = async (key) => {
  try {
    const commentCount = await axios.post("/api/others/getcommentcount", {
      post_id: key.split("_")[0],
    });
    console.log("commentCount", commentCount.data);
    return commentCount.data;
  } catch (error) {
    console.log("error", error);
  }
};

export default function PostCard({ post }) {
  const answer = false;
  const { data: username } = useSWRImmutable(post.user_id, getUsername, {
    keepPreviousData: true,
  });
  const { data: commentCount } = useSWRImmutable(
    post._id ? `${post._id}_getcommentcountinforum` : undefined,
    getCommentCount,
    { keepPreviousData: true, revalidateOnMount: true }
  );

  return (
    <LazyLoad once>
      <Stack direction="row">
        <Stack>
          <Stack>
            <NextLink href={`/${encodeURIComponent(post.slug)}`} passHref>
              <Link
                variant="h2"
                textAlign="left"
                sx={{
                  p: 0,
                  justifyContent: "flex-start",
                  textDecorationStyle: "dotted",
                }}
                gutterBottom
                underline="always"
              >
                {truncate(startCase(lowerCase(post.title)), {
                  length: 150,
                  omission: " ...",
                })}
                {post.post_type === "question" && (
                  <QuestionMarkIcon fontSize="small" />
                )}
              </Link>
            </NextLink>

            <React.Fragment>
              {post.post_type === "post" && (
                <Stack>
                  <IntroRender
                    content={truncate(post.content, {
                      length: 150,
                      omission: ` ...`,
                    })}
                  />
                </Stack>
              )}
            </React.Fragment>

            <Grid
              container
              justifyContent="space-between"
              direction="row"
              sx={{ mt: 1 }}
            >
              <Grid item>
                <Stack alignItems="center" spacing={1} direction="row">
                  <Stack spacing={2} alignItems="center" direction="row">
                    <Stack spacing={0.5} alignItems="center" direction="row">
                      <PersonOutlineOutlinedIcon
                        sx={{ fontSize: "1rem" }}
                        fontSize="small"
                      />
                      <NextLink
                        href={`/profile/${encodeURIComponent(username)}`}
                        passHref
                      >
                        <Link underline="always" variant="caption">
                          @{username}
                        </Link>
                      </NextLink>
                    </Stack>
                    <Stack spacing={0.5} alignItems="center" direction="row">
                      <AccessTimeOutlinedIcon
                        sx={{ fontSize: "1rem" }}
                        fontSize="small"
                      />
                      <Typography variant="caption">
                        {dayjs().to(dayjs(post.createdAt))}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Stack alignItems="center" spacing={1} direction="row">
                        <CommentOutlinedIcon
                          sx={{ fontSize: "0.9rem" }}
                          fontSize="small"
                        />
                        <Typography variant="caption">
                          {commentCount}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </LazyLoad>
  );
}
