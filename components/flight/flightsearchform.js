import { Button, Container, Grid, Stack } from "@mui/material";
import React from "react";
import Locations from "./locations";
import Dates from "./singledate";
import TripSettings from "./tripsettings";
import DateRange from "./daterange";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function FlightSearchForm() {
  return (
    <Stack>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Locations index={0} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Locations index={1} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DateRange />
          </Grid>
          <Grid
            item
            display="flex"
            direction="row"
            justifyContent="flex-end"
            xs={12}
            sx={{ mt: 2 }}
          >
            <TripSettings />
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              size="small"
              startIcon={<SearchOutlinedIcon />}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}
