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
      <Stack sx={{ display: { xs: "none", sm: "flex" } }}>
        <Stack
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          direction="row"
          sx={{ ml: 2 }}
        >
          <CommentOutlinedIcon fontSize="small" />{" "}
          <Typography>{commentCount}</Typography>
        </Stack>
        <Stack
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          direction="row"
          sx={{ ml: 2 }}
        >
          <VisibilityOutlinedIcon fontSize="small" />{" "}
          <Typography>1240</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Stack>
          <Stack
            sx={{
              pb: 1,
              display: { xs: "flex", sm: "none" },
            }}
            direction="row"
            spacing={2}
          >
            <Stack alignItems="center" spacing={1} direction="row">
              <CommentOutlinedIcon fontSize="small" />{" "}
              <Typography>{commentCount}</Typography>
            </Stack>
            <Stack alignItems="center" spacing={1} direction="row">
              <VisibilityOutlinedIcon fontSize="small" />{" "}
              <Typography>1240</Typography>
            </Stack>
          </Stack>
          <Link
            sx={{
              p: 0,
              justifyContent: "flex-start",
              color: "text.primary",
            }}
            variant="h1"
            textAlign="left"
            gutterBottom
            href={`/${post.slug}`}
            underline="hover"
          >
            {startCase(lowerCase(post.title))}
          </Link>
          {post.post_type === "question" && commentCount === 0 ? (
            <Stack sx={{}}>
              <Stack alignItems="center">
                <Typography textAlign="center">
                  @{username} needs your help to figure this out
                </Typography>
                <Button
                  sx={{ width: "fit-content" }}
                  startIcon={<QuestionAnswerOutlinedIcon />}
                  href={`/${post.slug}`}
                >
                  Provide an Answer
                </Button>
              </Stack>
            </Stack>
          ) : (
            <React.Fragment>
              {post.post_type === "post" && (
                <Stack spacing={1}>
                  <ArticleRender
                    content={truncate(post.content, {
                      length: 220,
                      omission: ` ... <a style="cursor:pointer" href=/${post.slug}}>Read More</a>`,
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
                <Stack spacing={0.5} alignItems="center" direction="row">
                  <Stack spacing={0.5} alignItems="center" direction="row">
                    <PersonOutlineOutlinedIcon
                      sx={{ fontSize: "1rem" }}
                      fontSize="small"
                    />
                    <Link
                      underline="always"
                      href={`/profile/${username}`}
                      variant="caption"
                    >
                      @{username}
                    </Link>
                  </Stack>
                  <Stack spacing={0.5} alignItems="center" direction="row">
                    <AccessTimeOutlinedIcon
                      sx={{ fontSize: "1rem" }}
                      fontSize="small"
                    />
                    <LinkTypography variant="caption">
                      {dayjs(post.createdAt).format("Do MMMM, YYYY - hh:mm a")}
                    </LinkTypography>
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
