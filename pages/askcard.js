import { Avatar, Button, Grid, Stack, Typography } from "@mui/material";

export default function Ask() {
  return (
    <Stack sx={{ p: { xs: 1, sm: 2 } }} spacing={2} direction="row">
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
            sx={{ pb: 1, display: { xs: "flex", sm: "none" } }}
            direction="row"
            spacing={2}
          >
            <Typography>1240 votes</Typography>
            <Typography>1240 Comments</Typography>
            <Typography>1240 views</Typography>
          </Stack>
          <Typography color="primary.main" variant="h1" gutterBottom>
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
            spacing={1}
            direction="row"
            sx={{ mt: 0.5 }}
          >
            <Grid item>
              <Stack spacing={1} direction="row">
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  sx={{ height: "30px" }}
                >
                  canada
                </Button>
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  sx={{ height: "30px" }}
                >
                  ticket
                </Button>
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  sx={{ height: "30px" }}
                >
                  tours
                </Button>
              </Stack>
            </Grid>
            <Grid item>
              <Stack alignItems="center" spacing={1} direction="row">
                <Avatar
                  sx={{ height: "30px", width: "30px" }}
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                />
                <Typography>Sheriff Adeniyi on the 27 Aug, 2022 at 10:25pm</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
}
