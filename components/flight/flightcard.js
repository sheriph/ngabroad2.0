import { Box, Divider, Drawer, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Image from "next/image";
import ToFlightCard from "./toflightcard";
import FromFlightCard from "./fromflightcard";
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
import { money } from "../../lib/utility";
import { first, get, last } from "lodash";
import ItineraryCard from "./itinerarycard";
import dayjs from "dayjs";
import LocationName from "./airportname";
import SegmentCards from "./segmentcards";

export default function FlightCard({ flightOffer }) {
  const trip = useRecoilValue(trip_);
  const classOfBooking = useRecoilValue(class_);
  const passengers = useRecoilValue(passengers_);
  const startDate = useRecoilValue(startDate_);
  const endDate = useRecoilValue(endDate_);
  const [dates, setDates] = useRecoilState(dates_);
  const [locations, setLocations] = useRecoilState(locations_);
  const [multiCity, setMultiCity] = useRecoilState(multiCity_);
  const [queryParams, setQueryParams] = useRecoilState(queryParams_);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const closeDrawer = () => setOpenDrawer(false);

  return (
    <Paper
      sx={{ position: "relative", cursor: "pointer" }}
      //   onClick={() => setOpenDrawer(true)}
      variant="outlined"
    >
      <Typography
        sx={{
          position: "absolute",
          right: 0,
          backgroundColor: "primary.main",
          borderTopRightRadius: 3,
          borderBottomLeftRadius: 3,
          p: 0.5,
          color: "white",
        }}
      >
        {money(get(flightOffer, "price.grandTotal", 0))}
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          right: 0,
          backgroundColor: "primary.main",
          borderTopLeftRadius: 3,
          borderBottomRightRadius: 3,
          p: 0.5,
          color: "white",
          bottom: 0,
        }}
      >
        Select Flight
      </Typography>

      {flightOffer.itineraries.map((itinerary, index, itineraries) => {
        const it1 = itinerary;
        const it2 = itineraries[index + 1];
        const arrivalDateIt1 = get(
          last(get(it1, "segments", "")),
          "arrival.at",
          ""
        );
        const departureDateIt2 = get(
          first(get(it2, "segments", "")),
          "departure.at",
          ""
        );
        const date2 = dayjs(dayjs(departureDateIt2).format("YYYY-MM-DD"));
        const date1 = dayjs(dayjs(arrivalDateIt1).format("YYYY-MM-DD"));

        const diff = it2 ? date2.diff(date1, "days") : "";
        console.log("it1", it1, it2, arrivalDateIt1, departureDateIt2, diff);
        return (
          <Stack key={index}>
            <ItineraryCard itinerary={itinerary} />
            {it2 && (
              <Divider orientation="horizontal" flexItem>
                <Typography variant="caption">
                  {`${diff} days`} in{" "}
                  <LocationName
                    isAirport={false}
                    iataCode={get(
                      last(get(it1, "segments", "")),
                      "arrival.iataCode",
                      ""
                    )}
                  />
                </Typography>
              </Divider>
            )}
          </Stack>
        );
      })}

      {/*       <FromFlightCard />
       */}
    </Paper>
  );
}
