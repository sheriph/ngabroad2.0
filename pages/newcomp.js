import { Box, Button, Stack } from "@mui/material";
import React from "react";
import BookingClass from "../components/flight/bookingclass";
import DateRange from "../components/flight/daterange";
import Locations from "../components/flight/locations";
import Passengers from "../components/flight/passengers";
import Dates from "../components/flight/singledate";
import Trip from "../components/flight/trip";
import TripSettings from "../components/flight/tripsettings";
import { setCookie } from "cookies-next";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import FlightSearchForm from "../components/flight/flightsearchform";

export default function NewComp() {
  return (
    <React.Fragment>
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
      >
        {/* <BookingClass /> */}
        {/* <Passengers /> */}
        {/* <Trip /> */}
        {/*  <TripSettings /> */}
        {/*  <DateRange /> */}
        {/* <Dates item={1} /> */}
        {/* <Box width={400}>
        <Locations index={0} />
      </Box> */}
      </Box>
      <Stack alignItems="center" justifyContent="center">
        <FlightSearchForm />
      </Stack>
    </React.Fragment>
  );
}
