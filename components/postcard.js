import React from "react";
import {
  Avatar,
  Button,
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
import { getUsername, LinkTypography, titleCase } from "../lib/utility";
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

// @ts-ignore
export default React.memo(function PostCard({ post }) {
  const answer = false;
  const { data: username } = useSWRImmutable(post.user_id, getUsername, {
    keepPreviousData: true,
    errorRetryCount: 3,
    shouldRetryOnError: true,
    errorRetryInterval: 10000,
  });
  const { data: commentCount } = useSWRImmutable(
    post._id ? `${post._id}_getcommentcountinforum` : undefined,
    getCommentCount,
    {
      keepPreviousData: true,
      errorRetryCount: 3,
      shouldRetryOnError: true,
      errorRetryInterval: 10000,
    }
  );
  //console.log("commentCount, error", commentCount, error);

  return (
    <LazyLoad once>
      <Stack direction="row">
        <Stack>
          <Stack>
            <NextLink
              passHref
              href={`/${encodeURIComponent(post.slug)}`}
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
                {titleCase(post.title)}
              </Link>
            </NextLink>

            <Stack>
              <IntroRender
                content={truncate(post.content, {
                  length: 200,
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
                        {dayjs().to(dayjs(post.createdAt))}
                      </Typography>
                    </Stack>
                    <Stack>
                      {commentCount >= 0 ? (
                        <Stack alignItems="center" spacing={1} direction="row">
                          <CommentOutlinedIcon
                            sx={{ fontSize: "0.9rem" }}
                            fontSize="small"
                          />
                          <Typography variant="caption">
                            {commentCount}
                          </Typography>
                        </Stack>
                      ) : (
                        <Skeleton sx={{ width: 20, height: 20 }} />
                      )}
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
});
