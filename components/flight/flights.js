import { Box, Button, Drawer, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import {
  airlinesFilter_,
  blockLoading_,
  class_,
  dates_,
  endDate_,
  flightOffers_,
  flightOffer_,
  locations_,
  multiCity_,
  openFlightSearchDrawer_,
  passengers_,
  queryParams_,
  startDate_,
  stopFilterValue_,
  trip_,
} from "../../lib/recoil";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import { first, get, isEmpty, last, truncate } from "lodash";
import dayjs from "dayjs";
import useSWRImmutable from "swr/immutable";
import LazyLoad from "react-lazyload";

import dynamic from "next/dynamic";
import FlightCard from "../../components/flight/flightcard";
import SegmentCards from "../../components/flight/segmentcards";
import { useRouter } from "next/router";
import axios from "axios";
import { useSWRConfig } from "swr";

const FlightSearchForm = dynamic(
  () => import("../../components/flight/flightsearchform"),
  {
    ssr: false,
  }
);

const getFlightOffers = async (data) => {
  try {
    const name = await axios.post("/api/flights/flightoffers", {
      data: data,
    });

    return name.data;
  } catch (error) {
    console.log("getFlightOffers error", error.response);
    throw new Error(error.response);
  }
};

const getFilterOffer = async (key) => {
  try {
    const { airlines, stopValue, flightOffers } = JSON.parse(key);
    console.log("key", airlines, stopValue, flightOffers);
    const offers = await axios.post("/api/flights/filter", {
      airlines,
      stopValue,
      flightOffers,
    });
    console.log("offers.data", offers.data);
    return offers.data;
  } catch (error) {
    console.log("error", error);
  }
};

export default function Flights() {
  const [flightFormDrawer, setFlightFormDrawer] = useRecoilState(
    openFlightSearchDrawer_
  );

  const trip = useRecoilValue(trip_);

  const startDate = useRecoilValue(startDate_);
  const endDate = useRecoilValue(endDate_);
  const dates = useRecoilValue(dates_);
  const locations = useRecoilValue(locations_);
  const queryParams = useRecoilValue(queryParams_);
  const setFlightOffer = useSetRecoilState(flightOffer_);
  const setOffers = useSetRecoilState(flightOffers_);
  const [segmentsDrawer, setSegment] = React.useState(false);
  const closeDrawer = () => setSegment(false);
  const router = useRouter();
  const setBlockLoading = useSetRecoilState(blockLoading_);
  const stopValue = useRecoilValue(stopFilterValue_);

  const {
    data: flightOffers,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWRImmutable(
    router.pathname === "/flights" && !isEmpty(queryParams)
      ? JSON.stringify(queryParams)
      : undefined,
    getFlightOffers,
    {
      keepPreviousData: true,
      shouldRetryOnError: false,
    }
  );

  const airlines = useRecoilValue(airlinesFilter_);

  const key = flightOffers
    ? JSON.stringify({
        airlines,
        stopValue,
        flightOffers: get(flightOffers, "data", []),
      })
    : undefined;

  const {
    data: filteredOffers,
    isLoading: isLoading2,
    isValidating: isValidating2,
  } = useSWRImmutable(key, getFilterOffer, {
    keepPreviousData: true,
  });

  console.log("filteredOffers", filteredOffers, flightOffers);

  React.useEffect(() => {
    if (isLoading || isValidating || isLoading2 || isValidating2) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating, isLoading2, isValidating2]);

  React.useEffect(() => {
    setOffers(flightOffers);
  }, [JSON.stringify(flightOffers)]);

  console.log(
    "flightOffers error",
    error,
    //  flightOffers,
    flightOffers
    //  isLoading,
    //  isValidating,
    //   queryParams
  );

  return (
    <Stack>
      <Stack component={Paper} variant="outlined" sx={{ mb: 3, p: 1 }}>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {/* 
      // @ts-ignore */}
          <FlightSearchForm mutate={mutate} />
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            display: {
              xs: "flex",
              md: "none",
              position: "relative",
              cursor: "pointer",
            },
          }}
          onClick={() => setFlightFormDrawer(true)}
        >
          {!first(locations)?.prettyText ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ flexGrow: 1, height: 50 }}
            >
              <Typography variant="h1">No Search Record Found</Typography>
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -16,
                  right: -8,
                  p: 0.5,
                  backgroundColor: "primary.main",
                  color: "white",
                }}
              >
                Edit
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <Stack spacing={1} direction="row" alignItems="center">
                <Typography>
                  {truncate(first(locations)?.prettyText, { length: 25 })}
                </Typography>
                <ArrowRightAltOutlinedIcon />
                <Typography>
                  {trip === "multi"
                    ? "Multiple Destinations"
                    : truncate(last(locations)?.prettyText, { length: 25 })}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>
                  {trip === "return"
                    ? dayjs(startDate).format("ddd MMM DD")
                    : dayjs(first(dates)).format("ddd MMM DD")}
                </Typography>
                {trip !== "one_way" && <HorizontalRuleOutlinedIcon />}
                <Typography sx={{ flexGrow: 1 }}>
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
                {/* <Stack
                  sx={{ color: "primary.main", cursor: "pointer" }}
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  onClick={() => setFlightFormDrawer(true)}
                >
                  <DriveFileRenameOutlineOutlinedIcon />
                  <Typography>Modify</Typography>
                </Stack> */}
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    p: 0.5,
                    backgroundColor: "primary.main",
                    color: "white",
                  }}
                >
                  Edit
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
        <Drawer
          anchor="bottom"
          open={flightFormDrawer}
          onClose={() => setFlightFormDrawer((prev) => !prev)}
        >
          <Stack spacing={2} sx={{ p: 2 }}>
            {/* 
      // @ts-ignore */}
            <FlightSearchForm mutate={mutate} />
            {/* <Button
              onClick={() => setFlightFormDrawer(false)}
              size="small"
              variant="outlined"
            >
              Close
            </Button> */}
          </Stack>
        </Drawer>
      </Stack>
      <Stack spacing={3}>
        {filteredOffers?.map((flightOffer, index) => (
          <Stack
            onClick={() => {
              console.log("index", index);
              // @ts-ignore
              setFlightOffer(flightOffer);
              setSegment(true);
            }}
            // @ts-ignore
            key={flightOffer.id}
          >
            <LazyLoad unmountIfInvisible={true} key={index}>
              <FlightCard flightOffer={flightOffer} />
            </LazyLoad>
          </Stack>
        ))}
      </Stack>
      <Drawer
        sx={{
          // width: { sm: "100%", md: "700px" },
          zIndex: (t) => t.zIndex.appBar + 105,
          "& .MuiDrawer-paper": { width: { xs: "100%", md: 450 } },
        }}
        anchor="right"
        open={segmentsDrawer}
        onClose={closeDrawer}
      >
        <SegmentCards closeDrawer={closeDrawer} />
      </Drawer>
    </Stack>
  );
}

const flightOffers2 = {
  meta: {
    count: 10,
  },
  data: [
    {
      type: "flight-offer",
      id: "1",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 7,
      itineraries: [
        {
          duration: "PT29H16M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T21:59:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T23:18:00",
              },
              carrierCode: "DL",
              number: "5720",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H19M",
              id: "3",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "DL",
              number: "126",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "4",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT22H25M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T10:35:00",
              },
              arrival: {
                iataCode: "BOS",
                at: "2022-11-19T12:50:00",
              },
              carrierCode: "KL",
              number: "73",
              aircraft: {
                code: "781",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT8H15M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["DL"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "3",
              cabin: "FIRST",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "4",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "3",
              cabin: "FIRST",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "4",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 7,
      itineraries: [
        {
          duration: "PT29H16M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T21:59:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T23:18:00",
              },
              carrierCode: "DL",
              number: "5720",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H19M",
              id: "3",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "DL",
              number: "126",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "4",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT28H5M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "11",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T16:55:00",
              },
              arrival: {
                iataCode: "BOS",
                at: "2022-11-19T18:30:00",
              },
              carrierCode: "KL",
              number: "77",
              aircraft: {
                code: "77W",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT7H35M",
              id: "12",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["DL"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "3",
              cabin: "FIRST",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "4",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "11",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "12",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "3",
              cabin: "FIRST",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "4",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "11",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
            },
            {
              segmentId: "12",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 7,
      itineraries: [
        {
          duration: "PT29H16M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T21:59:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T23:18:00",
              },
              carrierCode: "DL",
              number: "5720",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H19M",
              id: "3",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "DL",
              number: "126",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "4",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT28H40M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "15",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T17:05:00",
              },
              arrival: {
                iataCode: "BOS",
                terminal: "E",
                at: "2022-11-19T19:05:00",
              },
              carrierCode: "KL",
              number: "617",
              aircraft: {
                code: "332",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT8H",
              id: "16",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["DL"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "3",
              cabin: "FIRST",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "4",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "15",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "16",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "3",
              cabin: "FIRST",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "4",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "15",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
            },
            {
              segmentId: "16",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 9,
      itineraries: [
        {
          duration: "PT29H16M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T21:59:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T23:18:00",
              },
              carrierCode: "VS",
              number: "3013",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H19M",
              id: "5",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "VS",
              number: "3889",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "6",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT22H25M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T10:35:00",
              },
              arrival: {
                iataCode: "BOS",
                at: "2022-11-19T12:50:00",
              },
              carrierCode: "KL",
              number: "73",
              aircraft: {
                code: "781",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT8H15M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["VS"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "UPPER",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "UPPER",
              class: "L",
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 9,
      itineraries: [
        {
          duration: "PT29H16M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T21:59:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T23:18:00",
              },
              carrierCode: "VS",
              number: "3013",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H19M",
              id: "5",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "VS",
              number: "3889",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "6",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT28H5M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "11",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T16:55:00",
              },
              arrival: {
                iataCode: "BOS",
                at: "2022-11-19T18:30:00",
              },
              carrierCode: "KL",
              number: "77",
              aircraft: {
                code: "77W",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT7H35M",
              id: "12",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["VS"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "11",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "UPPER",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "12",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
            },
            {
              segmentId: "11",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "UPPER",
              class: "L",
            },
            {
              segmentId: "12",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "6",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 9,
      itineraries: [
        {
          duration: "PT29H16M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T21:59:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T23:18:00",
              },
              carrierCode: "VS",
              number: "3013",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H19M",
              id: "5",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "VS",
              number: "3889",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "6",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT28H40M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "15",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T17:05:00",
              },
              arrival: {
                iataCode: "BOS",
                terminal: "E",
                at: "2022-11-19T19:05:00",
              },
              carrierCode: "KL",
              number: "617",
              aircraft: {
                code: "332",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT8H",
              id: "16",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["VS"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "15",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "UPPER",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "16",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "5",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
            },
            {
              segmentId: "6",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "UPPER",
              class: "Z",
            },
            {
              segmentId: "15",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "UPPER",
              class: "L",
            },
            {
              segmentId: "16",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "7",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 3,
      itineraries: [
        {
          duration: "PT30H16M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T20:59:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T22:24:00",
              },
              carrierCode: "DL",
              number: "5693",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H25M",
              id: "7",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "DL",
              number: "126",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "8",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT22H25M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T10:35:00",
              },
              arrival: {
                iataCode: "BOS",
                at: "2022-11-19T12:50:00",
              },
              carrierCode: "KL",
              number: "73",
              aircraft: {
                code: "781",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT8H15M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["DL"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "7",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "W",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "8",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "7",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "W",
            },
            {
              segmentId: "8",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "8",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 3,
      itineraries: [
        {
          duration: "PT32H15M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T19:00:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T20:30:00",
              },
              carrierCode: "DL",
              number: "5626",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H30M",
              id: "1",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "DL",
              number: "126",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "2",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT22H25M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T10:35:00",
              },
              arrival: {
                iataCode: "BOS",
                at: "2022-11-19T12:50:00",
              },
              carrierCode: "KL",
              number: "73",
              aircraft: {
                code: "781",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT8H15M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["DL"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "W",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "W",
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "9",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 3,
      itineraries: [
        {
          duration: "PT32H40M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T18:35:00",
              },
              arrival: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-01T20:24:00",
              },
              carrierCode: "DL",
              number: "5716",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H49M",
              id: "9",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "DL",
              number: "126",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "10",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT22H25M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "13",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T10:35:00",
              },
              arrival: {
                iataCode: "BOS",
                at: "2022-11-19T12:50:00",
              },
              carrierCode: "KL",
              number: "73",
              aircraft: {
                code: "781",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT8H15M",
              id: "14",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["DL"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "9",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "W",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "10",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "9",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "W",
            },
            {
              segmentId: "10",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "13",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
            },
            {
              segmentId: "14",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "10",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2022-10-16",
      numberOfBookableSeats: 3,
      itineraries: [
        {
          duration: "PT30H16M",
          segments: [
            {
              departure: {
                iataCode: "BOS",
                terminal: "A",
                at: "2022-11-01T20:59:00",
              },
              arrival: {
                iataCode: "LGA",
                terminal: "C",
                at: "2022-11-01T22:24:00",
              },
              carrierCode: "DL",
              number: "5693",
              aircraft: {
                code: "E75",
              },
              duration: "PT1H25M",
              id: "7",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2022-11-02T19:30:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-03T08:15:00",
              },
              carrierCode: "DL",
              number: "126",
              aircraft: {
                code: "76W",
              },
              operating: {
                carrierCode: "DL",
              },
              duration: "PT7H45M",
              id: "8",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT28H5M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "2",
                at: "2022-11-18T20:25:00",
              },
              arrival: {
                iataCode: "AMS",
                at: "2022-11-18T23:00:00",
              },
              carrierCode: "KL",
              number: "1706",
              aircraft: {
                code: "73J",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT2H35M",
              id: "11",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "AMS",
                at: "2022-11-19T16:55:00",
              },
              arrival: {
                iataCode: "BOS",
                at: "2022-11-19T18:30:00",
              },
              carrierCode: "KL",
              number: "77",
              aircraft: {
                code: "77W",
              },
              operating: {
                carrierCode: "KL",
              },
              duration: "PT7H35M",
              id: "12",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "USD",
        total: "7090.16",
        base: "4744.00",
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
        grandTotal: "7090.16",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["DL"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "7",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "W",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "8",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
              includedCheckedBags: {
                quantity: 2,
              },
            },
            {
              segmentId: "11",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "12",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
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
            currency: "USD",
            total: "3545.08",
            base: "2372.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "7",
              cabin: "PREMIUM_ECONOMY",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "W",
            },
            {
              segmentId: "8",
              cabin: "BUSINESS",
              fareBasis: "ZN1J05D2",
              brandedFare: "DLONEBIZ",
              class: "Z",
            },
            {
              segmentId: "11",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "DLONEBIZ",
              class: "L",
            },
            {
              segmentId: "12",
              cabin: "ECONOMY",
              fareBasis: "VL4X46M3",
              brandedFare: "STANDARD6",
              class: "V",
            },
          ],
        },
      ],
    },
  ],
  dictionaries: {
    locations: {
      MAD: {
        cityCode: "MAD",
        countryCode: "ES",
      },
      LGA: {
        cityCode: "NYC",
        countryCode: "US",
      },
      BOS: {
        cityCode: "BOS",
        countryCode: "US",
      },
      AMS: {
        cityCode: "AMS",
        countryCode: "NL",
      },
      JFK: {
        cityCode: "NYC",
        countryCode: "US",
      },
    },
    aircraft: {
      781: "BOEING 787-10",
      E75: "EMBRAER 175",
      332: "AIRBUS A330-200",
      "77W": "BOEING 777-300ER",
      "76W": "BOEING 767-300 (WINGLETS)",
      "73J": "BOEING 737-900",
    },
    currencies: {
      USD: "US DOLLAR",
    },
    carriers: {
      KL: "KLM ROYAL DUTCH AIRLINES",
      DL: "DELTA AIR LINES",
      VS: "VIRGIN ATLANTIC",
    },
  },
};
