import React from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Fab,
  Grid,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  capitalizeName,
  getUsername,
  LinkTypography,
  useAuthUser,
  useHost,
} from "../lib/utility";
import ReplyIcon from "@mui/icons-material/Reply";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import useSWRImmutable from "swr/immutable";
import ReactHtmlParser, { processNodes } from "react-html-parser";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import { useRecoilState } from "recoil";
import {
  addPost_,
  postReplyData_,
  replyPost_,
  updatePost_,
} from "../lib/recoil";
import { get, isNumber, lowerCase, startCase, truncate } from "lodash";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "next/router";
import QuoteReadMore from "./others/quotereadmore";

const advancedFormat = require("dayjs/plugin/advancedFormat");

dayjs.extend(advancedFormat);

export default function SinglePostCard({
  post,
  parentPost_id,
  isComment = false,
}) {
  const { user, loading, error, mutate } = useAuthUser();
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);
  const likes = get(post, "stats.votes", new Array()).filter(
    (vote) => vote.status
  ).length;

  const dislikes = get(post, "stats.votes", new Array()).filter(
    (vote) => !vote.status
  ).length;

  const shares = get(post, "stats.shares", new Array()).length;

  const [postReplyData, setPostReplyData] = useRecoilState(postReplyData_);
  const [updatePost, setUpdatePost] = useRecoilState(updatePost_);
  const [addPost, setAddPost] = useRecoilState(addPost_);

  const { data: username } = useSWRImmutable(post.user_id, getUsername);
  const { data: quoteUsername } = useSWRImmutable(
    get(post, "quote.user_id", ""),
    getUsername
  );

  const transform = (node, index) => {
    if (node.type === "tag" && node.name === "h2") {
      return (
        <Typography
          sx={{ my: "15px" }}
          variant="h2"
          align="center"
          component="h2"
          key={index}
        >
          {processNodes(node.children, transform)}
        </Typography>
      );
    }

    if (node.type === "tag" && node.name === "p") {
      return (
        <Typography component="p" key={index}>
          {processNodes(node.children, transform)}
        </Typography>
      );
    }

    if (node.type === "tag" && node.name === "img") {
      const { src, alt, width, height } = node.attribs;
      return (
        <Box
          sx={{
            my: 2,
            width: "70%",
            height: "70%",
            mx: "auto",
          }}
          display="block"
          justifyContent="center"
          key={index}
        >
          <Image
            src={src}
            alt={alt}
            width="100%"
            height="100%"
            layout="responsive"
          />
        </Box>
      );
    }
  };

  const options = {
    decodeEntities: true,
    transform,
  };

  const showReply = () => {
    setPostReplyData({
      quotedUser_id: post.user_id,
      quotedPostContent: post.content,
      parentPost_id,
      postTitle: post.title,
      post: post,
      isComment: isComment,
    });
    setReplyPost(true);
  };

  const showUpdate = () => {
    setUpdatePost(true);
    setPostReplyData({
      parentPost_id: "",
      post: post,
      postTitle: "",
      quotedPostContent: "",
      quotedUser_id: "",
      isComment: isComment,
    });
    setAddPost(true);
  };

  console.log("post", post);
  return (
    <Stack spacing={2} direction="row">
      <Stack>
        <Stack>
          <Typography
            component="a"
            sx={{
              p: 0,
              justifyContent: "flex-start",
              cursor: "pointer",
              pb: 2,
            }}
            variant="h1"
            textAlign="left"
          >
            {isComment && `Re:`} {capitalizeName(post.title)}
          </Typography>
          <Stack>
            {isComment && get(post, "quote.content", "") && (
              <Stack
                sx={{
                  borderLeftStyle: "solid",
                  borderLeftColor: "primary.main",
                  borderLeftWidth: "5px",
                  pl: "10px",
                  // ml: "5px",
                  fontStyle: "italic",
                  mb: 2,
                }}
              >
                {quoteUsername ? (
                  <Link
                    href={`/${quoteUsername}`}
                    variant="caption"
                    underline="always"
                  >
                    {`@${quoteUsername}:`}
                  </Link>
                ) : (
                  <Skeleton variant="text">
                    <LinkTypography>By Adeniyi Sheriff</LinkTypography>
                  </Skeleton>
                )}
                <QuoteReadMore content={get(post, "quote.content", "")} />
              </Stack>
            )}
            <Box>{ReactHtmlParser(post.content, options)}</Box>
          </Stack>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Stack
              divider={<MoreVertIcon sx={{ fontSize: "1rem" }} />}
              direction="row"
              spacing={1}
            >
              {username ? (
                <Link
                  href={`/${username}`}
                  variant="caption"
                  underline="always"
                >
                  {`@${username}`}
                </Link>
              ) : (
                <Skeleton variant="text">
                  <LinkTypography>By Adeniyi Sheriff</LinkTypography>
                </Skeleton>
              )}
              <LinkTypography variant="caption">
                {dayjs(post.createdAt).format("Do MMMM, YYYY")}
              </LinkTypography>
            </Stack>
            <Stack spacing={1} direction="row">
              <Stack sx={{ cursor: "pointer" }} spacing={1} direction="row">
                <ThumbUpAltIcon fontSize="small" />
                <Typography variant="caption">{likes}</Typography>
              </Stack>
              <Stack sx={{ cursor: "pointer" }} spacing={1} direction="row">
                <ThumbDownIcon
                  sx={{ transform: "rotateY(180deg)" }}
                  fontSize="small"
                />
                <Typography variant="caption">{dislikes}</Typography>
              </Stack>
              <Stack sx={{ cursor: "pointer" }} spacing={1} direction="row">
                <ShareIcon fontSize="small" />
                <Typography variant="caption">Share</Typography>
              </Stack>
              <Stack
                onClick={showReply}
                sx={{ cursor: "pointer" }}
                spacing={1}
                direction="row"
              >
                <ReplyIcon fontSize="small" />
                <Typography variant="caption">Reply</Typography>
              </Stack>
              <Stack spacing={0.5} alignItems="center" direction="row">
                <BookmarkAddOutlinedIcon
                  sx={{ fontSize: "1rem" }}
                  fontSize="small"
                />
                <Typography
                  onClick={() => {
                    console.log("clicked ");
                    //setReplyPost(true);
                  }}
                  variant="caption"
                >
                  Follow
                </Typography>
              </Stack>
            </Stack>
            <Divider />
            {user && user._id === post.user_id ? (
              <React.Fragment>
                <Stack direction="row" spacing={2}>
                  <LinkTypography onClick={showUpdate} variant="caption">
                    Edit Post
                  </LinkTypography>
                  <LinkTypography variant="caption">Delete Post</LinkTypography>
                </Stack>
                <Divider />
              </React.Fragment>
            ) : (
              ""
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
