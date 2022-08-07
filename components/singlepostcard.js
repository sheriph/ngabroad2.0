import React from "react";
import {
  Avatar,
  Button,
  Divider,
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
            }}
            variant="h1"
            textAlign="left"
            gutterBottom
          >
            Making sense of principal component analysis, eigenvectors &
            eigenvalues
          </Typography>
          <Typography>
            In today's pattern recognition class my professor talked about PCA,
            eigenvectors and eigenvalues. I understood the mathematics of it. If
            I'm asked to find eigenvalues etc. I'll do it correctly like ...
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
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
