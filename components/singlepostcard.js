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
import ShareIcon from "@mui/icons-material/Share";
import { useRecoilState } from "recoil";
import {
  addPost_,
  postReplyData_,
  replyPost_,
  updatePost_,
} from "../lib/recoil";
import {
  forEach,
  get,
  isEqual,
  isNumber,
  lowerCase,
  startCase,
  truncate,
} from "lodash";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "next/router";
import QuoteReadMore from "./others/quotereadmore";
import ArticleRender from "./others/articlerender";
import { toast } from "react-toastify";

const advancedFormat = require("dayjs/plugin/advancedFormat");

dayjs.extend(advancedFormat);

export default function SinglePostCard({
  post,
  parentPost,
  isComment = false,
}) {
  const { user } = useAuthUser();
  const [replyPost, setReplyPost] = useRecoilState(replyPost_);

  const [postReplyData, setPostReplyData] = useRecoilState(postReplyData_);
  const [updatePost, setUpdatePost] = useRecoilState(updatePost_);
  const [addPost, setAddPost] = useRecoilState(addPost_);

  const getVotes = async (post_id) => {
    try {
      const key = post_id.split("_")[0];
      const votes = await axios.post("/api/getvotes", { post_id: key });
      console.log("votes", votes.data);
      return votes.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const getFollows = async (key) => {
    try {
      const follows = await axios.post(key, { user_id: user?._id });
      console.log("follows fetcher", follows.data);
      return follows.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const { data: username } = useSWRImmutable(post.user_id, getUsername);
  const { data: quoteUsername } = useSWRImmutable(
    get(post, "quote.user_id", ""),
    getUsername
  );

  const {
    data: votes,
    mutate: mutatevotes,
    error: votesError,
    isValidating: validatevotes,
  } = useSWRImmutable(`${post._id}_votesforapost`, getVotes);

  const { data: follows, mutate: mutatefollows } = useSWRImmutable(
    user?._id && "/api/getfollows",
    getFollows
  );
  console.log("follows", follows);
  console.log("votes", post.post_type, votes, votesError, validatevotes);

  const showReply = () => {
    if (!user) {
      toast.error("Please sign-in to comment");
      return;
    }
    setPostReplyData({
      parentPost,
      post,
      isComment: isComment,
    });
    setReplyPost(true);
  };

  const showUpdate = () => {
    if (!user) {
      toast.error("Please sign-in to comment");
      return;
    }
    setUpdatePost(true);
    setPostReplyData({
      post,
      parentPost,
      isComment: isComment,
    });
    setAddPost(true);
  };

  const upvotes = votes ? votes.filter((vote) => vote.status).length : 0;
  const downvotes = votes ? votes.filter((vote) => !vote.status).length : 0;

  const handleVote = async (status) => {
    // console.log("vote status", status);
    let alreadyVoted = false;
    forEach(votes, (vote) => {
      alreadyVoted = isEqual(
        { user_id: vote.user_id, status: vote.status },
        { user_id: user._id, status: status }
      );
    });
    console.log("reachable code alreadyVoted", alreadyVoted);
    if (alreadyVoted) {
      const newVotes = votes.filter(
        (vote) =>
          !isEqual(
            { user_id: vote.user_id, status: vote.status },
            { user_id: user._id, status: status }
          )
      );
      try {
        await mutatevotes(newVotes, {
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        });
        await axios.post("/api/vote", {
          user_id: user._id,
          status,
          post_id: post._id,
          post_title: post.title,
          slug: post.slug,
          post_type: post.post_type,
          remove: true,
        });
        await mutatevotes(newVotes, {
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        });
      } catch (error) {
        console.log("error", error);
      }
      return;
    }
    let hasOppositeVote = false;
    forEach(votes, (vote) => {
      hasOppositeVote = vote.user_id === user._id;
    });
    console.log("reachable code hasOppositeVote", hasOppositeVote);
    if (hasOppositeVote) {
      const myVote = {
        post_id: post._id,
        user_id: user._id,
        status: status,
      };
      const newVotes = votes.map((vote) => {
        let hasOppositeVote = vote.user_id === user._id;
        if (hasOppositeVote) {
          return myVote;
        } else {
          return vote;
        }
      });
      console.log("votes in mutate", newVotes);

      await mutatevotes(newVotes, {
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });

      try {
        await axios.post("/api/vote", {
          user_id: user._id,
          status,
          post_id: post._id,
          post_title: post.title,
          slug: post.slug,
          post_type: post.post_type,
        });
        await mutatevotes(newVotes, {
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        });
      } catch (error) {
        console.log("error", error);
      }
    } else {
      const myVote = {
        post_id: post._id,
        user_id: user._id,
        status: status,
      };
      const newVotes = [...votes, myVote];
      try {
        await mutatevotes(newVotes, {
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        });
        await axios.post("/api/vote", {
          user_id: user._id,
          status,
          post_id: post._id,
          post_title: post.title,
          slug: post.slug,
          post_type: post.post_type,
        });
        await mutatevotes(newVotes, {
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        });
      } catch (error) {
        console.log("error", error);
      }
    }
    return;
  };

  const isFollow = follows
    ? follows.map((follow) => follow.post_id === post._id).includes(true)
    : false;

  const handleFollow = async (remove) => {
    const newFollows = remove
      ? follows.filter((follow) => !follow.post_id)
      : [...follows, { post_id: post._id }];
    try {
      await mutatefollows(newFollows, {
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
      await axios.post("/api/follow", {
        user_id: user._id,
        post_id: post._id,
        post_title: post.title,
        slug: post.slug,
        remove: remove,
        post_type: post.post_type,
      });

      await mutatefollows(newFollows, {
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("post", post);
  return (
    <Stack spacing={2} direction="row">
      <Stack sx={{ width: "100%" }}>
        <Stack>
          <Typography
            sx={{
              p: 0,
              justifyContent: "flex-start",
              pb: 1,
            }}
            variant="h1"
            textAlign="left"
          >
            {isComment && `Re:`}{" "}
            {parentPost.post_type === "question" && isComment
              ? truncate(capitalizeName(post.title), { length: 70 })
              : capitalizeName(post.title)}
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
                    href={`/user/${quoteUsername}`}
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
            <Box>
              {/*  {ReactHtmlParser(
                post.post_type === "question" ? "" : post.content,
                options
              )} */}
              <ArticleRender
                content={post.post_type === "question" ? "" : post.content}
              />
            </Box>
          </Stack>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Stack
              divider={<MoreVertIcon sx={{ fontSize: "1rem" }} />}
              direction="row"
              spacing={1}
            >
              {username ? (
                <Link
                  href={`/user/${username}`}
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
              <Typography variant="caption">
                {dayjs(post.createdAt).format("Do MMMM, YYYY hh:mm a")}
              </Typography>
            </Stack>
            <Stack spacing={1} direction="row">
              <Stack
                onClick={() => handleVote(true)}
                sx={{ cursor: "pointer" }}
                spacing={1}
                direction="row"
              >
                <ThumbUpAltIcon
                  sx={{ width: 17, height: 17 }}
                  fontSize="small"
                />
                <Typography variant="caption">{upvotes}</Typography>
              </Stack>
              <Stack
                onClick={() => handleVote(false)}
                sx={{ cursor: "pointer" }}
                spacing={1}
                direction="row"
              >
                <ThumbDownIcon
                  sx={{
                    width: 15,
                    height: 15,
                    transform: "rotateY(180deg)",
                  }}
                  fontSize="small"
                />
                <Typography variant="caption">{downvotes}</Typography>
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
              {!isComment && (
                <Stack
                  onClick={() => handleFollow(isFollow)}
                  spacing={0.5}
                  alignItems="center"
                  direction="row"
                  sx={{ cursor: "pointer" }}
                >
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
                    {isFollow ? "Unfollow" : "Follow"}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Divider />
            {user && user._id === post.user_id ? (
              <React.Fragment>
                <Stack direction="row" spacing={2}>
                  <LinkTypography onClick={showUpdate} variant="caption">
                    Edit Post
                  </LinkTypography>
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
