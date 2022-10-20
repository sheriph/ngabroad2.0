import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Image from "next/image";
import { alpha } from "@mui/material/styles";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  class_,
  dates_,
  endDate_,
  flightOffer_,
  locations_,
  multiCity_,
  passengers_,
  queryParams_,
  startDate_,
  trip_,
} from "../../lib/recoil";
import {
  find,
  first,
  get,
  last,
  lowerCase,
  sortBy,
  startCase,
  uniq,
  uniqBy,
} from "lodash";
import { getStops, money, titleCase } from "../../lib/utility";
import dayjs from "dayjs";
import LocationName from "./airportname";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import ClearIcon from "@mui/icons-material/Clear";
import StopOutlinedIcon from "@mui/icons-material/StopOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WhereToVoteOutlinedIcon from "@mui/icons-material/WhereToVoteOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import AirlineName from "./airlinename";

export default function SegmentCards({ closeDrawer }) {
  const trip = useRecoilValue(trip_);
  const classOfBooking = useRecoilValue(class_);
  const passengers = useRecoilValue(passengers_);
  const startDate = useRecoilValue(startDate_);
  const endDate = useRecoilValue(endDate_);
  const [dates, setDates] = useRecoilState(dates_);
  const [locations, setLocations] = useRecoilState(locations_);
  const [multiCity, setMultiCity] = useRecoilState(multiCity_);
  const [queryParams, setQueryParams] = useRecoilState(queryParams_);
  const flightOffer = useRecoilValue(flightOffer_);
  const [open, setOpen] = React.useState(1000);
  const [showPrice, setShowPrice] = React.useState(false);

  const VerticalLine = ({ height = 30 }) => (
    <Box
      sx={{
        //  borderLeft: "0.5px",
        background: (t) => t.palette.grey[500],
        //  borderStyle: "solid",
        height: height,
        width: "1px",
        //  ml: 0.6,
        // mr: 1.6,
        position: "absolute",
        left: 91,
        zIndex: 1,
      }}
    />
  );

  const sx = {
    width: 15,
    height: 15,
    mr: 4,
    zIndex: 2,
    backgroundColor: "background.default",
    position: "relative",
    left: 16,
  };

  console.log("flightOffer in view", flightOffer);

  console.log("dictionaries", dictionaries);

  const prices = sortBy(
    uniqBy(
      get(flightOffer, "travelerPricings", []).map((traveler) => ({
        travelerType: get(traveler, "travelerType", ""),
        price: get(traveler, "price.total", ""),
      })),
      "travelerType"
    ),
    ["travelerType"]
  );

  const startIataCode = get(
    first(get(first(get(flightOffer, "itineraries", [])), "segments", [])),
    "departure.iataCode",
    ""
  );

  const endIataCode = get(
    last(get(last(get(flightOffer, "itineraries", [])), "segments", [])),
    "arrival.iataCode",
    ""
  );

  const endIataCode2 = get(
    first(get(last(get(flightOffer, "itineraries", [])), "segments", [])),
    "departure.iataCode",
    ""
  );

  console.log("endIataCode2", startIataCode, endIataCode, endIataCode2);

  return (
    <Stack sx={{ backgroundColor: (t) => t.palette.background.default }}>
      <Stack
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        component={Paper}
        square
        sx={{ p: 1 }}
      >
        <Stack>
          <Typography gutterBottom variant="h1">
            Full Itinerary Details
          </Typography>
          <Typography variant="h2">
            <LocationName
              iataCode={startIataCode}
              isAirport={false}
              showCountry={false}
            />{" "}
            -{" "}
            <LocationName
              iataCode={
                startIataCode === endIataCode ? endIataCode2 : endIataCode
              }
              isAirport={false}
              showCountry={false}
            />
          </Typography>
        </Stack>
        <IconButton onClick={closeDrawer}>
          <ClearIcon />
        </IconButton>
      </Stack>
      {get(flightOffer, "itineraries", []).map(
        (itinerary, itineraryIndex, itineraries) => {
          return (
            <React.Fragment key={itineraryIndex}>
              <Stack
                justifyContent="flex-end"
                spacing={3}
                sx={{ mt: 2, pl: 1, mr: 1 }}
                direction="row"
              >
                <Stack direction="row">
                  <FlightOutlinedIcon
                    sx={{
                      transform: "rotate(90deg)",
                      mr: 1,
                      width: 20,
                      height: 20,
                    }}
                  />
                  <Typography>
                    <LocationName
                      iataCode={get(
                        last(get(itinerary, "segments", [])),
                        "arrival.iataCode",
                        ""
                      )}
                      isAirport={false}
                    />
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <AccessTimeOutlinedIcon
                    sx={{ mr: 1, width: 20, height: 20 }}
                  />
                  <Typography>
                    {get(itinerary, "duration", "")
                      .replace("PT", "")
                      .replace("H", "H ")
                      .toLowerCase()}
                  </Typography>
                </Stack>
              </Stack>

              {get(itinerary, "segments", []).map(
                (segment, index, segments) => {
                  const departureTime = get(segment, "departure.at", "");
                  const arrivalTime = get(segment, "arrival.at", "");

                  const lastSegment = Boolean(segments.length === index + 1);

                  const arrivalTimeLastSegment = get(
                    last(segments),
                    "arrival.at",
                    ""
                  );

                  const nextItin = itineraries[itineraryIndex + 1];

                  const depTimeNextItinFirstSeg = get(
                    first(get(nextItin, "segments", [])),
                    "departure.at",
                    ""
                  );

                  const stay = Math.ceil(
                    dayjs(depTimeNextItinFirstSeg).diff(
                      arrivalTimeLastSegment,
                      "days",
                      true
                    )
                  );

                  const nextSegment = segments[index + 1];

                  const depTimeNextSegment = get(
                    nextSegment,
                    "departure.at",
                    ""
                  );

                  const layover = dayjs(depTimeNextSegment).diff(
                    arrivalTime,
                    "m"
                  );

                  const classOfBooking = get(
                    find(
                      get(
                        first(get(flightOffer, "travelerPricings", [])),
                        "fareDetailsBySegment",
                        []
                      ),
                      { segmentId: get(segment, "id", "") }
                    ),
                    "class",
                    ""
                  );

                  const cabin = startCase(
                    lowerCase(
                      get(
                        find(
                          get(
                            first(get(flightOffer, "travelerPricings", [])),
                            "fareDetailsBySegment",
                            []
                          ),
                          { segmentId: get(segment, "id", "") }
                        ),
                        "cabin",
                        ""
                      )
                    )
                  );

                  const bags = sortBy(
                    uniqBy(
                      get(flightOffer, "travelerPricings", []).map(
                        (traveler) => ({
                          travelerType: get(traveler, "travelerType", ""),
                          segmentBagQty: get(
                            find(get(traveler, "fareDetailsBySegment", []), {
                              segmentId: get(segment, "id", ""),
                            }),
                            "includedCheckedBags.quantity",
                            ""
                          ),
                        })
                      ),
                      "travelerType"
                    ),
                    ["travelerType"]
                  );

                  return (
                    <Stack key={index}>
                      <Stack sx={{ p: 1, mt: 1 }}>
                        <Stack alignItems="center" direction="row">
                          <Box width="60px" />
                          <CalendarTodayIcon sx={sx} />
                          <Typography variant="caption">
                            {dayjs(
                              get(segment, "departure.at", new Date())
                            ).format("ddd MMM DD")}
                          </Typography>
                        </Stack>
                        <Stack alignItems="center" direction="row">
                          <Box width="60px" />
                          <VerticalLine />
                        </Stack>
                      </Stack>
                      <Paper sx={{ p: 1 }}>
                        <Stack alignItems="center" direction="row">
                          <Box width="60px" />
                          <VerticalLine />
                          <Typography sx={{ ml: 6 }} variant="caption">
                            <LocationName
                              iataCode={get(segment, "departure.iataCode", "")}
                              isAirport={false}
                            />
                          </Typography>
                        </Stack>
                        <Stack alignItems="center" direction="row">
                          <Box width="60px">
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              {dayjs(departureTime).format("h:mm A")}
                            </Typography>
                          </Box>
                          <FiberManualRecordIcon
                            sx={{
                              ...sx,
                              backgroundColor: (t) =>
                                alpha(t.palette.background.paper, 0.1),
                            }}
                          />
                          <Typography variant="caption">
                            <LocationName
                              iataCode={get(segment, "departure.iataCode", "")}
                              isAirport={true}
                            />
                          </Typography>
                        </Stack>
                        <Stack
                          alignItems="center"
                          direction="row"
                          sx={{
                            backgroundColor: (t) =>
                              alpha(t.palette.secondary.main, 0.3),
                            mx: -1,
                          }}
                        >
                          <Box width="60px" />
                          <VerticalLine height={110} />
                          <Typography sx={{ ml: 7 }} variant="caption">
                            {cabin} {"Class"} ({classOfBooking})
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            mx: -1,
                            py: 1,
                            pr: 1,
                            backgroundColor: (t) =>
                              alpha(t.palette.primary.light, 0.2),
                          }}
                          alignItems="center"
                          direction="row"
                        >
                          <Box width="60px">
                            <Box sx={{ ml: 1 }}>
                              <Image
                                src={`/airlinelogo/${get(
                                  segment,
                                  "carrierCode",
                                  ""
                                )}16.png`}
                                width="16px"
                                height="16px"
                              />
                            </Box>
                          </Box>
                          <AirplanemodeActiveIcon
                            sx={{
                              ...sx,
                              transform: "rotate(180deg)",
                              backgroundColor: (t) =>
                                alpha(t.palette.primary.light, 0),
                              left: 24,
                            }}
                          />
                          <Chip
                            sx={{
                              fontSize: "0.75rem !important",
                              mr: 1,
                              ml: 1,
                            }}
                            size="small"
                            color="primary"
                            label={
                              <AirlineName
                                iataCode={get(segment, "carrierCode", "")}
                              />
                            }
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Chip
                              sx={{
                                fontSize: "0.75rem",
                                backgroundColor: (t) =>
                                  alpha(t.palette.primary.light, 0.4),
                              }}
                              size="small"
                              label={get(segment, "duration", "")
                                .replace("PT", "")
                                .replace("H", "H ")
                                .toLowerCase()}
                            />
                          </Box>
                          <IconButton
                            onClick={() => {
                              if (index === open) {
                                setOpen(1000);
                              } else {
                                setOpen(index);
                              }
                            }}
                            sx={{ p: "1px" }}
                            size="small"
                          >
                            <UnfoldLessIcon />
                          </IconButton>
                        </Stack>

                        <Collapse
                          sx={{
                            backgroundColor: (t) =>
                              alpha(t.palette.primary.light, 0.2),
                            mx: -1,
                          }}
                          in={open === index}
                        >
                          <Stack alignItems="center" direction="row">
                            <Box width="60px" />
                            <VerticalLine height={50} />
                            <Stack sx={{ width: "100%", px: 1 }}>
                              {/*  <Typography sx={{ ml: 7 }} variant="caption">
                                Flight Information:
                              </Typography> */}
                              {get(segment, "carrierCode", "") !==
                                get(segment, "operating.carrierCode", "") && (
                                <Stack
                                  justifyContent="space-between"
                                  direction="row"
                                >
                                  <Typography sx={{ ml: 7 }} variant="caption">
                                    Validating Carrier:
                                  </Typography>
                                  <Typography sx={{ ml: 7 }} variant="caption">
                                    <AirlineName
                                      iataCode={get(
                                        segment,
                                        "operating.carrierCode",
                                        ""
                                      )}
                                    />
                                  </Typography>
                                </Stack>
                              )}
                              <Stack
                                justifyContent="space-between"
                                direction="row"
                              >
                                <Typography sx={{ ml: 7 }} variant="caption">
                                  Bags:
                                </Typography>
                                <Typography sx={{ ml: 7 }} variant="caption">
                                  <Stack
                                    component="span"
                                    divider={<span>,</span>}
                                    direction="row"
                                  >
                                    {bags.map((bag, index, bags) => (
                                      <React.Fragment key={index}>
                                        {`${
                                          bag.segmentBagQty
                                            ? `${titleCase(bag.travelerType)} ${
                                                bag.segmentBagQty
                                              }x23kg`
                                            : `${titleCase(bag.travelerType)} 0`
                                        }`}
                                      </React.Fragment>
                                    ))}
                                  </Stack>
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Collapse>

                        <Stack alignItems="center" direction="row">
                          <Box width="60px">
                            <Typography variant="caption">
                              {dayjs(
                                get(segment, "arrival.at", new Date())
                              ).format("MMM DD")}
                            </Typography>
                          </Box>
                          <VerticalLine height={120} />
                          <Typography sx={{ ml: 6 }} variant="caption">
                            <LocationName
                              iataCode={get(segment, "arrival.iataCode", "")}
                              isAirport={false}
                            />
                          </Typography>
                        </Stack>
                        <Stack alignItems="center" direction="row">
                          <Box width="60px">
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              {dayjs(
                                get(segment, "arrival.at", new Date())
                              ).format("h:mm A")}
                            </Typography>
                          </Box>
                          <FiberManualRecordIcon
                            sx={{
                              ...sx,
                              backgroundColor: (t) =>
                                alpha(t.palette.background.paper, 0.1),
                            }}
                          />
                          <Typography variant="caption">
                            <LocationName
                              iataCode={get(segment, "arrival.iataCode", "")}
                              isAirport={true}
                            />
                          </Typography>
                        </Stack>
                      </Paper>
                      <Stack alignItems="center" direction="row">
                        <Box width="60px" />
                        <WhereToVoteOutlinedIcon
                          sx={{
                            ...sx,
                            left: 24,
                            backgroundColor: "background.default",
                          }}
                        />
                        <Stack sx={{ ml: 1, mt: 2 }}>
                          <Typography variant="caption">
                            Arrives{" "}
                            <LocationName
                              iataCode={get(segment, "arrival.iataCode", "")}
                              isAirport={false}
                              showCountry={true}
                            />
                          </Typography>
                          {lastSegment && stay ? (
                            <Stack direction="row">
                              <LocalHotelIcon
                                sx={{ width: 15, height: 15, mr: 1 }}
                              />
                              <Typography variant="caption">
                                {stay} {`Day${stay > 1 ? "s" : ""}`} Stay
                              </Typography>
                            </Stack>
                          ) : (
                            <React.Fragment>
                              {Boolean(layover) && (
                                <Stack direction="row">
                                  <AccessTimeOutlinedIcon
                                    sx={{ width: 15, height: 15, mr: 1 }}
                                  />
                                  <Typography variant="caption">
                                    {`${Math.floor(layover / 60)}h ${
                                      layover % 60
                                    }m`}{" "}
                                    Layover
                                  </Typography>
                                </Stack>
                              )}
                            </React.Fragment>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  );
                }
              )}
            </React.Fragment>
          );
        }
      )}
      <Stack
        // justifyContent="space-between"
        alignItems="flex-start"
        direction="row"
        component={Paper}
        variant="outlined"
        square
        sx={{ p: 1, mt: 3 }}
      >
        <Stack sx={{ flexGrow: 1 }}>
          <Stack alignItems="center" direction="row">
            <Typography sx={{ flexGrow: 1 }} color="primary.main" variant="h1">
              {money(Number(get(flightOffer, "price.total", 0)))}
            </Typography>
            <IconButton onClick={() => setShowPrice(!showPrice)}>
              <UnfoldLessIcon />
            </IconButton>
          </Stack>
          <Collapse in={showPrice}>
            <Stack sx={{ mt: 2 }}>
              {prices.map((price, index) => (
                <Stack
                  key={index}
                  justifyContent="space-between"
                  direction="row"
                >
                  <Typography variant="caption">
                    {money(Number(price.price))}
                  </Typography>
                  <Typography
                    textAlign="right"
                    sx={{ mr: 2 }}
                    variant="caption"
                  >
                    {titleCase(price.travelerType)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </Stack>
        <Button size="small" variant="contained" sx={{ ml: 2 }}>
          Book Now
        </Button>
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

const { dictionaries } = flightOffers;
