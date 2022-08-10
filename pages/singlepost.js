import React from "react";
import { Box, Container, Fab, Snackbar, Stack } from "@mui/material";
import Footer from "../components/footer.js/footer";
import Header from "../components/header/header";
import SinglePostComponent from "../components/others/singlepostcomponent";
import EditIcon from "@mui/icons-material/Edit";

export default function Questions() {
  return (
    <Stack spacing={1}>
      <Box component={Container}>
        <Header />
        <SinglePostComponent />
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={null}
        >
          <Box sx={{ "& > :not(style)": { m: 1 } }}>
            <Fab
              size="small"
              variant="circular"
              color="primary"
              aria-label="edit"
            >
              <EditIcon />
            </Fab>
          </Box>
        </Snackbar>
      </Box>
      <Footer />
    </Stack>
  );
}
