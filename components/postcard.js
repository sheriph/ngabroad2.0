import React from "react";
import { Avatar, Button, Grid, Stack, Typography } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function PostCard({ post }) {
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
          <CommentIcon fontSize="small" /> <Typography>12</Typography>
        </Stack>
        <Stack
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          direction="row"
          sx={{ ml: 2 }}
        >
          <VisibilityIcon fontSize="small" /> <Typography>1240</Typography>
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
              <CommentIcon fontSize="small" /> <Typography>12</Typography>
            </Stack>
            <Stack alignItems="center" spacing={1} direction="row">
              <VisibilityIcon fontSize="small" /> <Typography>1240</Typography>
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
          <Typography>
            In today's pattern recognition class my professor talked about PCA,
            eigenvectors and eigenvalues. I understood the mathematics of it. If
            I'm asked to find eigenvalues etc. I'll do it correctly like ...
          </Typography>
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            sx={{ mt: 0.5 }}
          >
            <Grid item>
              <Stack alignItems="center" spacing={1} direction="row">
                <Avatar
                  sx={{ height: "20px", width: "20px" }}
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                />
                <Typography variant="caption">
                  Sheriff Adeniyi on the 27 Aug, 2022 at 10:25pm
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
}
