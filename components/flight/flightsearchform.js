import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import React from "react";
import Locations from "./locations";
import Dates from "./singledate";
import TripSettings from "./tripsettings";
import DateRange from "./daterange";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  class_,
  dates_,
  endDate_,
  locations_,
  multiCity_,
  openFlightSearchDrawer_,
  passengers_,
  queryParams_,
  startDate_,
  trip_,
} from "../../lib/recoil";
import { dropRight, first, get, initial, last, uniqueId } from "lodash";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddLocationOutlinedIcon from "@mui/icons-material/AddLocationOutlined";
import useSWRImmutable from "swr/immutable";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

export default function FlightSearchForm({ mutate }) {
  const trip = useRecoilValue(trip_);
  const classOfBooking = useRecoilValue(class_);
  const passengers = useRecoilValue(passengers_);
  const startDate = useRecoilValue(startDate_);
  const endDate = useRecoilValue(endDate_);
  const [dates, setDates] = useRecoilState(dates_);
  const [locations, setLocations] = useRecoilState(locations_);
  const [multiCity, setMultiCity] = useRecoilState(multiCity_);
  const [originDestinations, setOriginDestinations] = React.useState("[]");
  const [travelers, setTravelers] = React.useState(null);
  const [queryParams, setQueryParams] = useRecoilState(queryParams_);
  const router = useRouter();
  const setFlightFormDrawer = useSetRecoilState(openFlightSearchDrawer_);

  React.useEffect(() => {
    console.log("running effect");
    if (trip === "return") {
      const originDestinations = [
        {
          id: "1",
          originLocationCode: get(first(locations), "data.iataCode", ""),
          destinationLocationCode: get(last(locations), "data.iataCode", ""),
          departureDateTimeRange: {
            date: dayjs(startDate).format("YYYY-MM-DD"),
            time: "00:00:00",
          },
        },
        {
          id: "2",
          originLocationCode: get(last(locations), "data.iataCode", ""),
          destinationLocationCode: get(first(locations), "data.iataCode", ""),
          departureDateTimeRange: {
            date: dayjs(endDate).format("YYYY-MM-DD"),
            time: "00:00:00",
          },
        },
      ];
      // @ts-ignore
      setOriginDestinations(originDestinations);
    } else if (trip === "one_way") {
      const originDestinations = [
        {
          id: "1",
          originLocationCode: get(first(locations), "data.iataCode", ""),
          destinationLocationCode: get(last(locations), "data.iataCode", ""),
          departureDateTimeRange: {
            date: dayjs(first(dates)).format("YYYY-MM-DD"),
            time: "00:00:00",
          },
        },
      ];
      // @ts-ignore
      setOriginDestinations(originDestinations);
    } else if (trip === "multi") {
      const modifyLocations = locations.map((location, index, arr) => {
        if (Boolean(index % 2)) return false;
        return {
          originLocationCode: get(location, "data.iataCode", ""),
          destinationLocationCode: get(arr[index + 1], "data.iataCode", ""),
          departureDateTimeRange: {
            date: dayjs(dates[index]).format("YYYY-MM-DD"),
            time: "00:00:00",
          },
        };
      });
      const modifyDates = dates.map((date, index) => {
        const l1 = index === 0 ? 0 : index * 2;
        const l2 = index === 0 ? 1 : index * 2 + 1;
        return {
          id: `${index + 1}`,
          originLocationCode: get(locations[l1], "data.iataCode", ""),
          destinationLocationCode: get(locations[l2], "data.iataCode", ""),
          departureDateTimeRange: {
            date: dayjs(date).format("YYYY-MM-DD"),
            time: "00:00:00",
          },
        };
      });
      const originDestinations = modifyLocations
        .filter((location) => location)
        .map((location, index) => ({ ...location, id: `${index + 1}` }));
      // @ts-ignore
      setOriginDestinations(modifyDates);
    }
  }, [
    JSON.stringify(locations),
    JSON.stringify(dates),
    JSON.stringify(startDate),
    JSON.stringify(endDate),
    JSON.stringify(trip),
  ]);

  React.useEffect(() => {
    const travelers = [
      ...Array.from(
        {
          length: passengers.adult,
        },
        (_, i) => ({
          travelerType: "ADULT",
        })
      ),
      ...Array.from(
        {
          length: passengers.child,
        },
        (_, i) => ({
          travelerType: "CHILD",
        })
      ),
      ...Array.from(
        {
          length: passengers.infant,
        },
        (_, i) => ({
          travelerType: "HELD_INFANT",
        })
      ),
    ];
    const adultIds = Array.from(
      { length: passengers.adult },
      (_, i) => `${i + 1}`
    );

    const formattedTravelers = travelers.map((traveler, index) => {
      if (traveler.travelerType === "HELD_INFANT") {
        return {
          ...traveler,
          id: `${index + 1}`,
          associatedAdultId: adultIds.pop(),
        };
      } else {
        return {
          ...traveler,
          id: `${index + 1}`,
        };
      }
    });
    // @ts-ignore
    setTravelers(formattedTravelers);
  }, [JSON.stringify(passengers)]);

  const flightSearch = () => {
    if (!locations[0]?.data) {
      toast.error("Departure Location is required");
      return;
    } else if (!locations[1]?.data) {
      toast.error("Arrival Location is required");
      return;
    }
    const queryParams = {
      trip: trip,
      currencyCode: "NGN",
      originDestinations: originDestinations,
      travelers: travelers,
      sources: ["GDS"],
      searchCriteria: {
        maxFlightOffers: 50,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: classOfBooking,
              coverage: "MOST_SEGMENTS",
              originDestinationIds: ["1"],
            },
          ],
          carrierRestrictions: {
            excludedCarrierCodes: ["OO"],
          },
        },
      },
    };

    console.log("queryParams", queryParams);

    // @ts-ignore
    setQueryParams((prev) => {
      if (JSON.stringify({ ...queryParams }) === JSON.stringify(prev)) {
        mutate && mutate();
      }
      return { ...queryParams };
    });

    setTimeout(() => {
      if (router.pathname !== "/flights") {
        router.push("/flights");
      } else {
        setFlightFormDrawer(false);
      }
    }, 300);
  };

  console.log(
    "values",
    //  trip,
    //  classOfBooking,
    //  passengers,
    // startDate,
    //  endDate,
    dates,
    locations
    // JSON.parse(originDestinations)
    // JSON.parse(travelers)
    // queryParams
  );

  const addTrip = () => {
    console.log("locations 1", locations);

    const newLocations = [
      last(locations),
      {
        prettyText: "",
        data: null,
      },
    ];

    // @ts-ignore
    setLocations((prev) => [...prev, ...newLocations]);
    const newDate = dayjs(last(dates)).add(1, "day").toDate();
    console.log("locations 2", locations);
    setDates((prev) => [...prev, newDate]);
    const fn = () => {
      setMultiCity((prev) => [
        ...prev,
        // @ts-ignore
        { a: last(prev)?.a + 2, b: last(prev)?.b + 2 },
      ]);
    };

    setTimeout(() => fn(), 100);
  };

  const minusTrip = () => {
    if (multiCity.length > 1) {
      setLocations((prev) => [...dropRight(prev, 2)]);
      setDates((prev) => [...dropRight(prev, 1)]);
      setMultiCity((prev) => initial([...prev]));
    }
  };

  if (trip === "return" || trip === "one_way") {
    return (
      <Stack>
        <Stack>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <Locations index={0} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Locations index={1} />
            </Grid>
            <Grid item xs={12} md={4}>
              {trip === "return" ? <DateRange /> : <Dates item={0} />}
            </Grid>
            <Grid
              item
              display="flex"
              direction="row"
              container
              justifyContent="flex-end"
              xs={12}
              sx={{ mt: 2 }}
            >
              <TripSettings />
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                size="small"
                startIcon={<SearchOutlinedIcon />}
                onClick={flightSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack>
        <Grid container spacing={1}>
          {multiCity.map(({ a, b }, index) => {
            return (
              <Grid key={index} item xs={12} sx={{ mb: 1 }} container>
                <Grid item xs={12} md={4}>
                  <Locations index={a} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Locations index={b} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Dates item={index} />
                </Grid>
              </Grid>
            );
          })}
          <Grid justifyContent="center" spacing={2} item container xs={12}>
            <Grid item xs="auto">
              <IconButton onClick={addTrip} color="primary">
                <AddLocationOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid item xs="auto">
              <IconButton
                // @ts-ignore
                onClick={minusTrip}
                color="error"
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid
            item
            display="flex"
            direction="row"
            container
            justifyContent="flex-end"
            xs={12}
            sx={{ mt: 2 }}
          >
            <TripSettings />
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              size="small"
              startIcon={<SearchOutlinedIcon />}
              onClick={flightSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
