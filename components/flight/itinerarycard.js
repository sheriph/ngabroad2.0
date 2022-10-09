import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Image from "next/image";
import { alpha } from "@mui/material/styles";
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
import { first, get, last, uniq } from "lodash";
import { getStops } from "../../lib/utility";
import dayjs from "dayjs";
import LocationName from "./airportname";

export default function ItineraryCard({ itinerary }) {
  const trip = useRecoilValue(trip_);
  const classOfBooking = useRecoilValue(class_);
  const passengers = useRecoilValue(passengers_);
  const startDate = useRecoilValue(startDate_);
  const endDate = useRecoilValue(endDate_);
  const [dates, setDates] = useRecoilState(dates_);
  const [locations, setLocations] = useRecoilState(locations_);
  const [multiCity, setMultiCity] = useRecoilState(multiCity_);
  const [queryParams, setQueryParams] = useRecoilState(queryParams_);
  console.log("itinerary", itinerary);
  return (
    <Stack spacing={1} sx={{ p: 1 }}>
      <Typography variant="caption">
        {dayjs(
          get(first(get(itinerary, "segments", [])), "departure.at", new Date())
        ).format("ddd MMM DD")}
      </Typography>
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
            <span style={{ fontWeight: "bold" }}>
              {dayjs(
                get(
                  first(get(itinerary, "segments", [])),
                  "departure.at",
                  new Date()
                )
              ).format("h:mm A")}
            </span>{" "}
            <LocationName
              isAirport={true}
              iataCode={get(
                first(get(itinerary, "segments", [])),
                "departure.iataCode",
                ""
              )}
            />
          </Typography>
          <Stack spacing={1} direction="row">
            <Typography variant="caption">
              {get(itinerary, "duration", "").replace("PT", "").toLowerCase()}
            </Typography>

            {uniq(
              get(itinerary, "segments", []).map((item) =>
                get(item, "carrierCode", "")
              )
            ).map((carrierCode, index) => (
              <Box key={index}>
                <Image
                  src={`/airlinelogo/${carrierCode}16.png`}
                  width="16px"
                  height="16px"
                />
              </Box>
            ))}

            <Typography variant="caption">
              {getStops(get(itinerary, "segments", []).length - 1)}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ top: "6px", position: "relative" }}
          >
            <span style={{ fontWeight: "bold" }}>
              {dayjs(
                get(
                  last(get(itinerary, "segments", [])),
                  "arrival.at",
                  new Date()
                )
              ).format("h:mm A")}
            </span>{" "}
            <LocationName
              isAirport={true}
              iataCode={get(
                last(get(itinerary, "segments", [])),
                "arrival.iataCode",
                ""
              )}
            />
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="caption">
        {dayjs(
          get(last(get(itinerary, "segments", [])), "departure.at", new Date())
        ).format("ddd MMM DD")}
      </Typography>
    </Stack>
  );
}
