import React from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Fab,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LinkTypography } from "../lib/utility";
import ReplyIcon from "@mui/icons-material/Reply";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";

import EditIcon from "@mui/icons-material/Edit";

import ShareIcon from "@mui/icons-material/Share";

export default function SinglePostCard({ post }) {
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
            Making sense of principal component analysis, eigenvectors &
            eigenvalues
          </Typography>
          <Typography>
            In today's pattern recognition class my professor talked about PCA,
            eigenvectors and eigenvalues. I understood the mathematics of it. If
            I'm asked to find eigenvalues etc. I'll do it correctly like ... I
            am an instructor in a STEM field. I am teaching an upper-division
            course where I try to interact with the students rather than just
            lecturing. I am teaching in the students' native language; there do
            not seem to be any language issues. I am struggling because the
            students tend to give wrong answers to simple questions I ask during
            lectures. These really are simple questions; they should have
            learned this material during the first few weeks of their first
            year. To make matters clear, let me give an example. If we are in
            the middle of a proof, I might ask "what is the result of log (a *
            b)?". The right answer is "log(a) + log(b)", however, they will say
            "log(a) * log (b)" as an answer. Then, I did not see any other way
            and would say "no guys, it is log(a)+log(b)." Situations like this
            repeated over the entire semester. Students complained to my boss
            and in the student evaluation that I was demeaning them and that I
            was upset when they answered something other than the answer I
            wanted to. I will teach some of these students next year in another
            course and I have a hard time trying to find a way to solve this
            issue. The only solution I see for this is to just lecture and not
            encourage participation in class. However, I was wondering if there
            would be any other wiser solution. Tips from here are good, but
            instead of a colleague, I'm dealing with students. Edit: This is
            actually an upper-division chemistry course. The situation above
            arises, for example, when I have to explain why pH + pOH = 14.
            Students should have learned that in general chemistry, but I like
            to derive it to remind them. When I perform the derivation, I start
            from the auto-ionization of water and eventually arrive at: 14 =
            -log ([H3O+][OH-]). Then I ask them how to simplify this in order to
            complete the proof. But they do not remember the properties of logs.
            I am an instructor in a STEM field. I am teaching an upper-division
            course where I try to interact with the students rather than just
            lecturing. I am teaching in the students' native language; there do
            not seem to be any language issues. I am struggling because the
            students tend to give wrong answers to simple questions I ask during
            lectures. These really are simple questions; they should have
            learned this material during the first few weeks of their first
            year. To make matters clear, let me give an example. If we are in
            the middle of a proof, I might ask "what is the result of log (a *
            b)?". The right answer is "log(a) + log(b)", however, they will say
            "log(a) * log (b)" as an answer. Then, I did not see any other way
            and would say "no guys, it is log(a)+log(b)." Situations like this
            repeated over the entire semester. Students complained to my boss
            and in the student evaluation that I was demeaning them and that I
            was upset when they answered something other than the answer I
            wanted to. I will teach some of these students next year in another
            course and I have a hard time trying to find a way to solve this
            issue. The only solution I see for this is to just lecture and not
            encourage participation in class. However, I was wondering if there
            would be any other wiser solution. Tips from here are good, but
            instead of a colleague, I'm dealing with students. Edit: This is
            actually an upper-division chemistry course. The situation above
            arises, for example, when I have to explain why pH + pOH = 14.
            Students should have learned that in general chemistry, but I like
            to derive it to remind them. When I perform the derivation, I start
            from the auto-ionization of water and eventually arrive at: 14 =
            -log ([H3O+][OH-]). Then I ask them how to simplify this in order to
            complete the proof. But they do not remember the properties of logs.
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Stack
              divider={<MoreVertIcon sx={{ fontSize: "1rem" }} />}
              direction="row"
              spacing={1}
            >
              <LinkTypography variant="caption">
                By Sheriff Adeniyi
              </LinkTypography>
              <LinkTypography variant="caption">
                Sep 5, 2022 at 10:25pm
              </LinkTypography>
            </Stack>
            <Stack spacing={1} direction="row">
              <Stack sx={{ cursor: "pointer" }} spacing={1} direction="row">
                <ThumbUpAltIcon fontSize="small" />
                <Typography variant="caption">1240</Typography>
              </Stack>
              <Stack sx={{ cursor: "pointer" }} spacing={1} direction="row">
                <ThumbDownIcon
                  sx={{ transform: "rotateY(180deg)" }}
                  fontSize="small"
                />
                <Typography variant="caption">1240</Typography>
              </Stack>
              <Stack sx={{ cursor: "pointer" }} spacing={1} direction="row">
                <ShareIcon fontSize="small" />
                <Typography variant="caption">Share</Typography>
              </Stack>
              <Stack sx={{ cursor: "pointer" }} spacing={1} direction="row">
                <ReplyIcon fontSize="small" />
                <Typography variant="caption">Reply</Typography>
              </Stack>
              <Stack spacing={0.5} alignItems="center" direction="row">
                <BookmarkAddOutlinedIcon
                  sx={{ fontSize: "1rem" }}
                  fontSize="small"
                />
                <Typography variant="caption">Follow Thread</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
