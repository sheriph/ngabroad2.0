import { Box, Button, Drawer, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
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
} from "../lib/recoil";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import { first, last, truncate } from "lodash";
import dayjs from "dayjs";

import dynamic from "next/dynamic";
import FlightCard from "../components/flight/flightcard";

const FlightSearchForm = dynamic(
  () => import("../components/flight/flightsearchform"),
  {
    ssr: false,
  }
);

export default function Flights() {
  const [drawerState, setDrawerState] = React.useState(false);
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
    <Stack>
      <Stack component={Paper} variant="outlined" sx={{ mb: 3, p: 1 }}>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {/* 
      // @ts-ignore */}
          <FlightSearchForm />
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          {!first(locations)?.prettyText ? (
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <Typography variant="h1">No Search Record Found</Typography>
            </Stack>
          ) : (
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <Stack spacing={1} direction="row" alignItems="center">
                <Typography>
                  {truncate(first(locations)?.prettyText, { length: 25 })}
                </Typography>
                <ArrowRightAltOutlinedIcon />
                <Typography>
                  {truncate(last(locations)?.prettyText, { length: 25 })}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>
                  {trip === "return"
                    ? dayjs(startDate).format("ddd MMM DD")
                    : dayjs(first(dates)).format("ddd MMM DD")}
                </Typography>
                {trip !== "one_way" && <HorizontalRuleOutlinedIcon />}
                <Typography>
                  {trip === "return" ? (
                    dayjs(endDate).format("ddd MMM DD")
                  ) : (
                    <React.Fragment>
                      {trip === "one_way"
                        ? ""
                        : dayjs(last(dates)).format("ddd MMM DD")}
                    </React.Fragment>
                  )}
                </Typography>
              </Stack>
            </Stack>
          )}
          <Stack
            sx={{ color: "primary.main", cursor: "pointer" }}
            spacing={1}
            direction="row"
            alignItems="center"
            onClick={() => setDrawerState(true)}
          >
            <DriveFileRenameOutlineOutlinedIcon />
            <Typography>Modify</Typography>
          </Stack>
        </Stack>
        <Drawer
          anchor="bottom"
          open={drawerState}
          onClose={() => setDrawerState((prev) => !prev)}
        >
          <Stack spacing={2} sx={{ p: 2 }}>
            {/* 
      // @ts-ignore */}
            <FlightSearchForm />
            <Button
              onClick={() => setDrawerState(false)}
              size="small"
              variant="outlined"
            >
              Close
            </Button>
          </Stack>
        </Drawer>
      </Stack>
      <Stack spacing={3}>
        {flightOffers.data.map((flightOffer, index) => (
          <Stack key={flightOffer.id}>
            <FlightCard flightOffer={flightOffer} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

const flightOffers = {
  meta: {
    count: 5,
  },
  data: [
    {
      type: "flight-offer",
      id: "1",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-12",
      numberOfBookableSeats: 4,
      itineraries: [
        {
          duration: "PT9H45M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "B",
                at: "2022-11-01T18:40:00",
              },
              arrival: {
                iataCode: "EWR",
                terminal: "C",
                at: "2022-11-01T20:14:00",
              },
              carrierCode: "UA",
              number: "2396",
              aircraft: {
                code: "73G",
              },
              operating: {
                carrierCode: "UA",
              },
              duration: "PT1H34M",
              id: "3",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "EWR",
                terminal: "C",
                at: "2022-11-01T21:15:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-02T09:25:00",
              },
              carrierCode: "SN",
              number: "9027",
              aircraft: {
                code: "763",
              },
              operating: {
                carrierCode: "UA",
              },
              duration: "PT7H10M",
              id: "4",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT4H45M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T17:35:00",
              },
              arrival: {
                iataCode: "BRU",
                at: "2022-11-18T20:00:00",
              },
              carrierCode: "SN",
              number: "3728",
              aircraft: {
                code: "320",
              },
              operating: {
                carrierCode: "SN",
              },
              duration: "PT2H25M",
              id: "11",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "BRU",
                at: "2022-11-18T21:10:00",
              },
              arrival: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-18T21:20:00",
              },
              carrierCode: "SN",
              number: "2103",
              aircraft: {
                code: "320",
              },
              operating: {
                carrierCode: "SN",
              },
              duration: "PT1H10M",
              id: "12",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT25H55M",
          segments: [
            {
              departure: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-28T17:50:00",
              },
              arrival: {
                iataCode: "BRU",
                at: "2022-11-28T19:55:00",
              },
              carrierCode: "SN",
              number: "2096",
              aircraft: {
                code: "320",
              },
              operating: {
                carrierCode: "SN",
              },
              duration: "PT1H5M",
              id: "15",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "BRU",
                at: "2022-11-29T11:55:00",
              },
              arrival: {
                iataCode: "IAD",
                at: "2022-11-29T14:45:00",
              },
              carrierCode: "SN",
              number: "8801",
              aircraft: {
                code: "77W",
              },
              operating: {
                carrierCode: "UA",
              },
              duration: "PT8H50M",
              id: "16",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "NGN",
        total: "3686078.00",
        base: "2525250.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
        ],
        grandTotal: "3686078.00",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["SN"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "NGN",
            total: "1863931.00",
            base: "1262625.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "3",
              cabin: "FIRST",
              fareBasis: "DNX00DNC",
              class: "D",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "4",
              cabin: "BUSINESS",
              fareBasis: "DNX00DNC",
              class: "D",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "11",
              cabin: "BUSINESS",
              fareBasis: "DNX00DNC",
              class: "D",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "12",
              cabin: "BUSINESS",
              fareBasis: "DNX00DNC",
              class: "D",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "15",
              cabin: "ECONOMY",
              fareBasis: "QKX47NCT",
              class: "Q",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "16",
              cabin: "ECONOMY",
              fareBasis: "QKX47NCT",
              class: "Q",
              includedCheckedBags: {
                quantity: 1,
              },
            },
          ],
        },
        {
          travelerId: "2",
          fareOption: "STANDARD",
          travelerType: "CHILD",
          price: {
            currency: "NGN",
            total: "1822147.00",
            base: "1262625.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "3",
              cabin: "FIRST",
              fareBasis: "DNX00DNC",
              class: "D",
            },
            {
              segmentId: "4",
              cabin: "BUSINESS",
              fareBasis: "DNX00DNC",
              class: "D",
            },
            {
              segmentId: "11",
              cabin: "BUSINESS",
              fareBasis: "DNX00DNC",
              class: "D",
            },
            {
              segmentId: "12",
              cabin: "BUSINESS",
              fareBasis: "DNX00DNC",
              class: "D",
            },
            {
              segmentId: "15",
              cabin: "ECONOMY",
              fareBasis: "QKX47NCT",
              class: "Q",
            },
            {
              segmentId: "16",
              cabin: "ECONOMY",
              fareBasis: "QKX47NCT",
              class: "Q",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "2",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-10",
      numberOfBookableSeats: 4,
      itineraries: [
        {
          duration: "PT10H45M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "E",
                at: "2022-11-01T22:55:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-02T11:10:00",
              },
              carrierCode: "LX",
              number: "53",
              aircraft: {
                code: "333",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT7H15M",
              id: "5",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-02T12:15:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-02T14:40:00",
              },
              carrierCode: "LX",
              number: "2026",
              aircraft: {
                code: "223",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT2H25M",
              id: "6",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT15H20M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T18:45:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-18T21:00:00",
              },
              carrierCode: "LX",
              number: "2033",
              aircraft: {
                code: "221",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT2H15M",
              id: "7",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-19T08:10:00",
              },
              arrival: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-19T09:05:00",
              },
              carrierCode: "LX",
              number: "316",
              aircraft: {
                code: "320",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT1H55M",
              id: "8",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT24H10M",
          segments: [
            {
              departure: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-28T20:00:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-28T22:35:00",
              },
              carrierCode: "LX",
              number: "339",
              aircraft: {
                code: "223",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT1H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-29T11:35:00",
              },
              arrival: {
                iataCode: "IAD",
                at: "2022-11-29T15:10:00",
              },
              carrierCode: "LX",
              number: "3200",
              aircraft: {
                code: "763",
              },
              operating: {
                carrierCode: "UA",
              },
              duration: "PT9H35M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "NGN",
        total: "6596839.00",
        base: "5205655.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
        ],
        grandTotal: "6596839.00",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["LX"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "NGN",
            total: "3308657.00",
            base: "2613065.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "7",
              cabin: "ECONOMY",
              fareBasis: "GR1",
              class: "Y",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "8",
              cabin: "ECONOMY",
              fareBasis: "KEUCLSP2",
              class: "K",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VEUCLSP0",
              class: "V",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "14",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "GR1",
              class: "G",
              includedCheckedBags: {
                quantity: 2,
              },
            },
          ],
        },
        {
          travelerId: "2",
          fareOption: "STANDARD",
          travelerType: "CHILD",
          price: {
            currency: "NGN",
            total: "3288182.00",
            base: "2592590.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
            },
            {
              segmentId: "7",
              cabin: "ECONOMY",
              fareBasis: "GR1",
              class: "Y",
            },
            {
              segmentId: "8",
              cabin: "ECONOMY",
              fareBasis: "KEUCLSP2",
              class: "K",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VEUCLSP0",
              class: "V",
            },
            {
              segmentId: "14",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "GR1",
              class: "G",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "3",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-10",
      numberOfBookableSeats: 4,
      itineraries: [
        {
          duration: "PT10H45M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "E",
                at: "2022-11-01T22:55:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-02T11:10:00",
              },
              carrierCode: "LX",
              number: "53",
              aircraft: {
                code: "333",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT7H15M",
              id: "5",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-02T12:15:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-02T14:40:00",
              },
              carrierCode: "LX",
              number: "2026",
              aircraft: {
                code: "223",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT2H25M",
              id: "6",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT17H25M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T18:45:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-18T21:00:00",
              },
              carrierCode: "LX",
              number: "2033",
              aircraft: {
                code: "221",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT2H15M",
              id: "9",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-19T10:20:00",
              },
              arrival: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-19T11:10:00",
              },
              carrierCode: "LX",
              number: "318",
              aircraft: {
                code: "223",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT1H50M",
              id: "10",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT24H10M",
          segments: [
            {
              departure: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-28T20:00:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-28T22:35:00",
              },
              carrierCode: "LX",
              number: "339",
              aircraft: {
                code: "223",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT1H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-29T11:35:00",
              },
              arrival: {
                iataCode: "IAD",
                at: "2022-11-29T15:10:00",
              },
              carrierCode: "LX",
              number: "3200",
              aircraft: {
                code: "763",
              },
              operating: {
                carrierCode: "UA",
              },
              duration: "PT9H35M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "NGN",
        total: "6596839.00",
        base: "5205655.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
        ],
        grandTotal: "6596839.00",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["LX"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "NGN",
            total: "3308657.00",
            base: "2613065.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "9",
              cabin: "ECONOMY",
              fareBasis: "GR1",
              class: "Y",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "10",
              cabin: "ECONOMY",
              fareBasis: "KEUCLSP2",
              class: "K",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VEUCLSP0",
              class: "V",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "14",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "GR1",
              class: "G",
              includedCheckedBags: {
                quantity: 2,
              },
            },
          ],
        },
        {
          travelerId: "2",
          fareOption: "STANDARD",
          travelerType: "CHILD",
          price: {
            currency: "NGN",
            total: "3288182.00",
            base: "2592590.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
            },
            {
              segmentId: "9",
              cabin: "ECONOMY",
              fareBasis: "GR1",
              class: "Y",
            },
            {
              segmentId: "10",
              cabin: "ECONOMY",
              fareBasis: "KEUCLSP2",
              class: "K",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VEUCLSP0",
              class: "V",
            },
            {
              segmentId: "14",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "GR1",
              class: "G",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "4",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-10",
      numberOfBookableSeats: 4,
      itineraries: [
        {
          duration: "PT14H10M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "E",
                at: "2022-11-01T22:55:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-02T11:10:00",
              },
              carrierCode: "LX",
              number: "53",
              aircraft: {
                code: "333",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT7H15M",
              id: "1",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-02T15:45:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-02T18:05:00",
              },
              carrierCode: "LX",
              number: "2032",
              aircraft: {
                code: "221",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT2H20M",
              id: "2",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT15H20M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T18:45:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-18T21:00:00",
              },
              carrierCode: "LX",
              number: "2033",
              aircraft: {
                code: "221",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT2H15M",
              id: "7",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-19T08:10:00",
              },
              arrival: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-19T09:05:00",
              },
              carrierCode: "LX",
              number: "316",
              aircraft: {
                code: "320",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT1H55M",
              id: "8",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT24H10M",
          segments: [
            {
              departure: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-28T20:00:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-28T22:35:00",
              },
              carrierCode: "LX",
              number: "339",
              aircraft: {
                code: "223",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT1H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-29T11:35:00",
              },
              arrival: {
                iataCode: "IAD",
                at: "2022-11-29T15:10:00",
              },
              carrierCode: "LX",
              number: "3200",
              aircraft: {
                code: "763",
              },
              operating: {
                carrierCode: "UA",
              },
              duration: "PT9H35M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "NGN",
        total: "6596839.00",
        base: "5205655.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
        ],
        grandTotal: "6596839.00",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["LX"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "NGN",
            total: "3308657.00",
            base: "2613065.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "7",
              cabin: "ECONOMY",
              fareBasis: "GR1",
              class: "Y",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "8",
              cabin: "ECONOMY",
              fareBasis: "KEUCLSP2",
              class: "K",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VEUCLSP0",
              class: "V",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "14",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "GR1",
              class: "G",
              includedCheckedBags: {
                quantity: 2,
              },
            },
          ],
        },
        {
          travelerId: "2",
          fareOption: "STANDARD",
          travelerType: "CHILD",
          price: {
            currency: "NGN",
            total: "3288182.00",
            base: "2592590.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
            },
            {
              segmentId: "7",
              cabin: "ECONOMY",
              fareBasis: "GR1",
              class: "Y",
            },
            {
              segmentId: "8",
              cabin: "ECONOMY",
              fareBasis: "KEUCLSP2",
              class: "K",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VEUCLSP0",
              class: "V",
            },
            {
              segmentId: "14",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "GR1",
              class: "G",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "5",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-10",
      numberOfBookableSeats: 4,
      itineraries: [
        {
          duration: "PT14H10M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "E",
                at: "2022-11-01T22:55:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-02T11:10:00",
              },
              carrierCode: "LX",
              number: "53",
              aircraft: {
                code: "333",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT7H15M",
              id: "1",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-02T15:45:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-02T18:05:00",
              },
              carrierCode: "LX",
              number: "2032",
              aircraft: {
                code: "221",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT2H20M",
              id: "2",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT17H25M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T18:45:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-18T21:00:00",
              },
              carrierCode: "LX",
              number: "2033",
              aircraft: {
                code: "221",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT2H15M",
              id: "9",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-19T10:20:00",
              },
              arrival: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-19T11:10:00",
              },
              carrierCode: "LX",
              number: "318",
              aircraft: {
                code: "223",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT1H50M",
              id: "10",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT24H10M",
          segments: [
            {
              departure: {
                iataCode: "LHR",
                terminal: "2",
                at: "2022-11-28T20:00:00",
              },
              arrival: {
                iataCode: "ZRH",
                at: "2022-11-28T22:35:00",
              },
              carrierCode: "LX",
              number: "339",
              aircraft: {
                code: "223",
              },
              operating: {
                carrierCode: "LX",
              },
              duration: "PT1H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "ZRH",
                at: "2022-11-29T11:35:00",
              },
              arrival: {
                iataCode: "IAD",
                at: "2022-11-29T15:10:00",
              },
              carrierCode: "LX",
              number: "3200",
              aircraft: {
                code: "763",
              },
              operating: {
                carrierCode: "UA",
              },
              duration: "PT9H35M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "NGN",
        total: "6596839.00",
        base: "5205655.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
        ],
        grandTotal: "6596839.00",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["LX"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "NGN",
            total: "3308657.00",
            base: "2613065.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "9",
              cabin: "ECONOMY",
              fareBasis: "GR1",
              class: "Y",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "10",
              cabin: "ECONOMY",
              fareBasis: "KEUCLSP2",
              class: "K",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VEUCLSP0",
              class: "V",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "14",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "GR1",
              class: "G",
              includedCheckedBags: {
                quantity: 2,
              },
            },
          ],
        },
        {
          travelerId: "2",
          fareOption: "STANDARD",
          travelerType: "CHILD",
          price: {
            currency: "NGN",
            total: "3288182.00",
            base: "2592590.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "ZNX09ERC",
              class: "Z",
            },
            {
              segmentId: "9",
              cabin: "ECONOMY",
              fareBasis: "GR1",
              class: "Y",
            },
            {
              segmentId: "10",
              cabin: "ECONOMY",
              fareBasis: "KEUCLSP2",
              class: "K",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VEUCLSP0",
              class: "V",
            },
            {
              segmentId: "14",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "GR1",
              class: "G",
            },
          ],
        },
      ],
    },
  ],
  dictionaries: {
    locations: {
      EWR: {
        cityCode: "NYC",
        countryCode: "US",
      },
      MAD: {
        cityCode: "MAD",
        countryCode: "ES",
      },
      ZRH: {
        cityCode: "ZRH",
        countryCode: "CH",
      },
      BRU: {
        cityCode: "BRU",
        countryCode: "BE",
      },
      BOS: {
        cityCode: "BOS",
        countryCode: "US",
      },
      LHR: {
        cityCode: "LON",
        countryCode: "GB",
      },
      IAD: {
        cityCode: "WAS",
        countryCode: "US",
      },
    },
    aircraft: {
      320: "AIRBUS A320",
      221: "AIRBUS  A220-100",
      333: "AIRBUS A330-300",
      223: "AIRBUS  A220-300",
      763: "BOEING 767-300/300ER",
      "77W": "BOEING 777-300ER",
      "73G": "BOEING 737-700",
    },
    currencies: {
      NGN: "NIGERIAN NAIRA",
    },
    carriers: {
      SN: "BRUSSELS AIRLINES",
      UA: "UNITED AIRLINES",
      LX: "SWISS INTERNATIONAL AIR LINES",
    },
  },
};
