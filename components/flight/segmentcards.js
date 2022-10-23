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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  blockLoading_,
  class_,
  dates_,
  endDate_,
  flightOffer_,
  locations_,
  multiCity_,
  OfferPricing_,
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
  omit,
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
import useSWRImmutable from "swr/immutable";
import axios from "axios";
import { useRouter } from "next/router";

const getFlightOfferPricing = async (offer) => {
  try {
    const trip = JSON.parse(offer).trip;
    const data = {
      data: {
        type: "flight-offers-pricing",
        flightOffers: [JSON.parse(offer)],
      },
    };
    console.log("getFlightOfferPricing", offer, trip);
    const offerPricing = await axios.post("/api/flights/offerpricing", {
      data: { data: JSON.stringify(data), trip },
    });
    return offerPricing.data;
  } catch (error) {
    console.log("error", error.response);
    throw new Error(error);
  }
};

export default function SegmentCards({ closeDrawer }) {
  const setBlockLoading = useSetRecoilState(blockLoading_);
  const flightOffer = useRecoilValue(flightOffer_);
  const [book, setBook] = React.useState(false);
  const [open, setOpen] = React.useState(1000);
  const [showPrice, setShowPrice] = React.useState(false);
  const setOfferPricing = useSetRecoilState(OfferPricing_);
  const router = useRouter();

  const {
    data: offerPricing,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWRImmutable(
    book ? JSON.stringify(flightOffer) : undefined,
    getFlightOfferPricing,
    {
      keepPreviousData: true,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        setOfferPricing(data);
        router.push("/flights/complete-booking");
      },
    }
  );

  console.log("offerPricing", offerPricing, error);

  React.useEffect(() => {
    return () => setBook(false);
  }, [null]);

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

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

  //const trip = window.localStorage.getItem("trip");

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

  // @ts-ignore
  const trip = flightOffer?.trip;

  console.log("endIataCode2", startIataCode, endIataCode, endIataCode2, trip);

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
            {trip === "multi" ? (
              "Multiple Destinations"
            ) : (
              <LocationName
                iataCode={trip === "return" ? endIataCode2 : endIataCode}
                isAirport={false}
                showCountry={false}
              />
            )}
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
        <Button
          onClick={() => {
            if (!book) {
              setBook(true);
            } else {
              mutate();
            }
          }}
          disabled={router.pathname === "/flights/complete-booking"}
          size="small"
          variant="contained"
          sx={{ ml: 2 }}
        >
          Book Now
        </Button>
      </Stack>
    </Stack>
  );
}
