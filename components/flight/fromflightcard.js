import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  class_,
  dates_,
  endDate_,
  locations_,
  multiCity_,
  passengers_,
  queryParams_,
  startDate_,
  trip_,
} from "../../lib/recoil";

export default function FromFlightCard() {
  const trip = useRecoilValue(trip_);
  const classOfBooking = useRecoilValue(class_);
  const passengers = useRecoilValue(passengers_);
  const startDate = useRecoilValue(startDate_);
  const endDate = useRecoilValue(endDate_);
  const [dates, setDates] = useRecoilState(dates_);
  const [locations, setLocations] = useRecoilState(locations_);
  const [multiCity, setMultiCity] = useRecoilState(multiCity_);
  const [queryParams, setQueryParams] = useRecoilState(queryParams_);
  return (
    <Stack spacing={1} sx={{ p: 1 }}>
      <Typography variant="caption">Mon Oct 10</Typography>
      <Stack direction="row">
        <Stack>
          <FiberManualRecordIcon sx={{ width: 10, height: 10, mb: "-7px" }} />
          <HorizontalRuleIcon sx={{ transform: "rotate(90deg)", ml: "-7px" }} />
          <AirplanemodeActiveIcon
            sx={{ width: 10, height: 10, transform: "rotate(180deg)" }}
          />
          <HorizontalRuleIcon sx={{ transform: "rotate(90deg)", ml: "-7px" }} />
          <FiberManualRecordIcon sx={{ width: 10, height: 10, mt: "-7px" }} />
        </Stack>
        <Stack>
          <Typography
            variant="caption"
            sx={{ top: "-6px", position: "relative" }}
          >
            <span style={{ fontWeight: "bold" }}>5:43 AM</span> Manchester
            Manchester–Boston Regional
          </Typography>
          <Stack spacing={1} direction="row">
            <Typography variant="caption">31h47m</Typography>
            <Box>
              <Image src={`/airlinelogo/kq16.png`} width="16px" height="16px" />
            </Box>
            <Box>
              <Image src={`/airlinelogo/ek16.png`} width="16px" height="16px" />
            </Box>
            <Typography variant="caption">3 stops</Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ top: "6px", position: "relative" }}
          >
            <span style={{ fontWeight: "bold" }}>5:43 AM</span> Dubai Dubai
            International (DXB)
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="caption">Mon Oct 10</Typography>
    </Stack>
  );
}
