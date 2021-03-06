import { Avatar, Button, Grid, Stack, Typography } from "@mui/material";

export default function PostCard({ post }) {
  return (
    <Stack spacing={2} direction="row" sx={{ ml: `-15px !important` }}>
      <Stack sx={{ display: { xs: "none", sm: "flex" } }}>
        <Typography textAlign="right" sx={{ whiteSpace: "nowrap" }}>
          1240 votes
        </Typography>
        <Typography textAlign="right" sx={{ whiteSpace: "nowrap" }}>
          1240 Comments
        </Typography>
        <Typography textAlign="right" sx={{ whiteSpace: "nowrap" }}>
          1240 views
        </Typography>
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
            <Typography>1240 votes</Typography>
            <Typography>1240 Comments</Typography>
            <Typography>1240 views</Typography>
          </Stack>
          <Typography
            component={Button}
            sx={{
              p: 0,
              justifyContent: "flex-start",
            }}
            color="primary.main"
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
                  sx={{ height: "25px", width: "25px" }}
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
