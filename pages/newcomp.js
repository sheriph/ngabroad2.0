import { Box, Stack } from "@mui/material";
import React from "react";
import BookingClass from "../components/flight/bookingclass";
import DateRange from "../components/flight/daterange";
import Passengers from "../components/flight/passengers";
import Trip from "../components/flight/trip";
import TripSettings from "../components/flight/tripsettings";

export default function NewComp() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {/* <BookingClass /> */}
      {/* <Passengers /> */}
      {/* <Trip /> */}
     {/*  <TripSettings /> */}
      <DateRange />
    </Box>
  );
}
