import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
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
import { default as NextLink } from "next/link";

import {
  capitalizeName,
  getUsername,
  LinkTypography,
  titleCase,
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
  login_,
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
import { useAuthenticator } from "@aws-amplify/ui-react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomizedDialogs from "./others/alert";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ForumIcon from "@mui/icons-material/Forum";
import ReplyCommentEditor from "./replycommenteditor";
import ModifyPostEditor from "./modifyposteditor";
import Modifycommenteditor from "./modifycommenteditor";


var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

// @ts-ignore
export default React.memo(function SinglePostCard({ post, parentPost, index }) {
  const { user: userExist } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const { user } = useAuthUser(userExist);

  const [addcommentDialog, setAddCommentDialog] = React.useState(false);
  const [replycommentDialog, setReplyCommentDialog] = React.useState(false);
  const [editcommentDialog, setEditCommentDialog] = React.useState(false);
  const [editPostDialog, setEditPostDialog] = React.useState(false);

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

  console.log("userExist", userExist);

  const { data: username } = useSWRImmutable(
    JSON.stringify({
      user_id: post.user_id,
      tag: "get username from user_id",
    }),
    getUsername
  );

  const {
    data: votes,
    mutate: mutatevotes,
    error: votesError,
    isValidating: isvalidatingvotes,
  } = useSWRImmutable(
    JSON.stringify({
      url: "/api/others/getvotes",
      tag: "Get votes for a single post",
      post_id: post._id,
    }),
    getVotes
  );

  // console.log("votes", votes);

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
    if (post.user_id === user._id) {
      toast.error("No self-voting allowed, let others clap for you!");
      return;
    }

    try {
      const newVote = {
        post_id: post._id,
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
    if (post.user_id === user._id) {
      toast.error("No self-voting allowed, let others clap for you!");
      return;
    }

    try {
      const newVote = {
        post_id: post._id,
        user_id: user._id,
        voteType: "downvote",
      };
      await axios.post("/api/others/vote", newVote);
      await mutatevotes();
    } catch (error) {
      console.log("error", error);
    }
  };

  //  console.log("post", post);
  return (
    <Stack spacing={1}>
      <Stack>
        <Stack>
          <Typography
            sx={{
              p: 0,
              justifyContent: "flex-start",
              pb: 1,
              fontWeight:"bold"
            }}
            variant="h1"
            textAlign="left"
            gutterBottom
          >
            {titleCase(post?.title || `Re: ${post?.post?.title}`)}
          </Typography>
          <Stack spacing={2}>
            {post?.replyPost?.content && (
              <Alert
                icon={<FormatQuoteIcon />}
                variant="outlined"
                sx={{ mb: 2, mt: 1 }}
              >
                <ArticleRender
                  content={
                    // @ts-ignore
                    post?.replyPost?.content
                  }
                />
              </Alert>
            )}
            <ArticleRender content={post.content} />
          </Stack>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Stack
              divider={<MoreVertIcon sx={{ fontSize: "1rem" }} />}
              direction="row"
              spacing={1}
            >
              {username ? (
                <NextLink
                  href={`/profile/${encodeURIComponent(username)}`}
                  passHref
                >
                  <Link underline="always" variant="caption">
                    @{username}
                  </Link>
                </NextLink>
              ) : (
                <Skeleton variant="text">
                  <LinkTypography>By Adeniyi Sheriff</LinkTypography>
                </Skeleton>
              )}
              <Stack alignItems="center" direction="row" spacing={1}>
                <AccessTimeIcon sx={{ fontSize: 13 }} />
                <Typography variant="caption">
                  {dayjs().to(dayjs(post.createdAt))}
                </Typography>
              </Stack>
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
              <Button
                sx={{ p: 0.5, fontSize: 12 }}
                startIcon={<ReplyIcon fontSize="small" />}
                color="inherit"
                onClick={() => setReplyCommentDialog(true)}
              >
                Reply
              </Button>
              <Button
                sx={{ p: 0.5, fontSize: 12, ml: 1 }}
                startIcon={<ForumIcon sx={{ fontSize: 14 }} fontSize="small" />}
                color="inherit"
                onClick={() => setAddCommentDialog(true)}
              >
                Add Comment
              </Button>
            </ButtonGroup>
            <Divider />
            {user && user._id === post.user_id ? (
              <React.Fragment>
                <Stack
                  onClick={() => {
                    if (index === 0) {
                      setEditPostDialog(true);
                    } else {
                      setEditCommentDialog(true);
                    }
                  }}
                  direction="row"
                  spacing={2}
                >
                  <LinkTypography variant="caption">
                    {index === 0 ? "Edit Post" : "Edit Comment"}
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
      <CustomizedDialogs
        open={replycommentDialog}
        setOpen={setReplyCommentDialog}
        zIndex={1402}
        title={`Re: ${get(parentPost, "title", "")}`}
      >
        <ReplyCommentEditor post={parentPost} replyPost={post} />
      </CustomizedDialogs>
      <CustomizedDialogs
        open={addcommentDialog}
        setOpen={setAddCommentDialog}
        zIndex={1402}
        title={`Add Comment: ${get(parentPost, "title", "")}`}
      >
        <ReplyCommentEditor post={parentPost} replyPost={null} />
      </CustomizedDialogs>
      <CustomizedDialogs
        open={editcommentDialog}
        setOpen={setEditCommentDialog}
        zIndex={1402}
        title={`Edit Comment: ${get(post, "content", "")}`}
      >
        <Modifycommenteditor
          // @ts-ignore
          post={post}
        />
      </CustomizedDialogs>
      <CustomizedDialogs
        open={editPostDialog}
        setOpen={setEditPostDialog}
        zIndex={1402}
        title={`Edit Post: ${get(parentPost, "title", "")}`}
      >
        <ModifyPostEditor
          // @ts-ignore
          post={parentPost}
        />
      </CustomizedDialogs>
    </Stack>
  );
});
