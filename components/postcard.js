import React from "react";
import { Avatar, Button, Grid, Stack, Typography } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateIcon from "@mui/icons-material/Create";
import { LinkTypography } from "../lib/utility";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

export default function PostCard({ post }) {
  const answer = false;
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
          <CommentOutlinedIcon fontSize="small" /> <Typography>12</Typography>
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
        <Stack
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          direction="row"
          sx={{ ml: 2 }}
        >
          <BookmarkBorderOutlinedIcon fontSize="small" />{" "}
          <Typography>5</Typography>
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
              <Typography>12</Typography>
            </Stack>
            <Stack alignItems="center" spacing={1} direction="row">
              <VisibilityOutlinedIcon fontSize="small" />{" "}
              <Typography>1240</Typography>
            </Stack>
            <Stack alignItems="center" spacing={1} direction="row">
              <BookmarkBorderOutlinedIcon fontSize="small" />{" "}
              <Typography>5</Typography>
            </Stack>
          </Stack>
          <Typography
            component="a"
            sx={{
              p: 0,
              justifyContent: "flex-start",
              cursor: "pointer",
            }}
            variant="h1"
            textAlign="left"
            gutterBottom
          >
            Making sense of principal component analysis, eigenvectors &
            eigenvalues
          </Typography>
          {answer ? (
            <Stack>
              <Typography>
                In today's pattern recognition class my professor talked about
                PCA, eigenvectors and eigenvalues. I understood the mathematics
                of it. If I'm asked to find eigenvalues etc. I'll do it
                correctly like ...
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{}}>
              <Stack alignItems="center">
                <Typography textAlign="center">
                  Sheriff needs your help to figure this out
                </Typography>
                <Button
                  sx={{ width: "fit-content" }}
                  startIcon={<QuestionAnswerOutlinedIcon />}
                >
                  Provide an Answer
                </Button>
              </Stack>
            </Stack>
          )}
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            sx={{ mt: 0.5 }}
          >
            <Grid item>
              <Stack alignItems="center" spacing={1} direction="row">
                <Stack spacing={0.5} alignItems="center" direction="row">
                  <Stack spacing={0.5} alignItems="center" direction="row">
                    <PersonOutlineOutlinedIcon
                      sx={{ fontSize: "1rem" }}
                      fontSize="small"
                    />
                    <LinkTypography variant="caption">
                      Sheriff Adeniyi
                    </LinkTypography>
                  </Stack>
                  <Stack spacing={0.5} alignItems="center" direction="row">
                    <AccessTimeOutlinedIcon
                      sx={{ fontSize: "1rem" }}
                      fontSize="small"
                    />
                    <LinkTypography variant="caption">
                      27th Aug, 2022 - 10:00 AM
                    </LinkTypography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack spacing={0.5} alignItems="center" direction="row">
                <BookmarkAddOutlinedIcon
                  sx={{ fontSize: "1rem" }}
                  fontSize="small"
                />
                <LinkTypography variant="caption">Follow Thread</LinkTypography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
}
