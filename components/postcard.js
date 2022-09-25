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

var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

const getCommentCount = async (key) => {
  try {
    const commentCount = await axios.post("/api/getcommentcount", {
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
  const { data: username } = useSWRImmutable(post.user_id, getUsername);
  const { data: commentCount } = useSWRImmutable(
    post._id ? `${post._id}_getcommentcountinforum` : undefined,
    getCommentCount
  );

  return (
    <Stack spacing={2} direction="row" sx={{ ml: `-15px !important` }}>
      <Stack sx={{ ml: { xs: 1, sm: 2 } }}>
        <Stack>
          <NextLink href={`/${encodeURIComponent(post.slug)}`} passHref>
            <Link
              variant="h1"
              textAlign="left"
              sx={{
                p: 0,
                justifyContent: "flex-start",
                color: "text.primary",
                textDecorationStyle: "dotted",
              }}
              gutterBottom
              underline="always"
            >
              {truncate(startCase(lowerCase(post.title)), {
                length: 150,
                omission: " ...",
              })}
            </Link>
          </NextLink>
          {post.post_type === "question" && commentCount === 0 ? (
            <Stack sx={{}}>
              <Stack alignItems="center">
                <NextLink
                  href={`/profile/${encodeURIComponent(username)}`}
                  passHref
                >
                  <Link underline="always" variant="caption">
                    @{username} needs your help to figure this out
                  </Link>
                </NextLink>
                <NextLink href={`/${encodeURIComponent(post.slug)}`} passHref>
                  <Button
                    sx={{ width: "fit-content" }}
                    startIcon={<QuestionAnswerOutlinedIcon />}
                    component="a"
                  >
                    Provide an Answer
                  </Button>
                </NextLink>
              </Stack>
            </Stack>
          ) : (
            <React.Fragment>
              {post.post_type === "post" && (
                <Stack spacing={1}>
                  <ArticleRender
                    content={truncate(post.content, {
                      length: 150,
                      omission: ` ...`,
                    })}
                  />
                </Stack>
              )}
            </React.Fragment>
          )}
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            sx={{ mt: 2 }}
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
                      {dayjs(post.createdAt).format("Do MMM, YYYY - hh:mm a")}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Stack alignItems="center" spacing={1} direction="row">
                      <CommentOutlinedIcon
                        sx={{ fontSize: "1rem" }}
                        fontSize="small"
                      />
                      <Typography>{commentCount}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
}
