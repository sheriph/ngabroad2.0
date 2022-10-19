import { Stack } from "@mui/material";
import React from "react";
import AirlineFilter from "./airlinefilter";

import StopsFilter from "./stopsfilter";

export default function FlightFilter() {
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <StopsFilter />
      <AirlineFilter />
    </Stack>
  );
}
