import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { filter, forEach, forIn, get, orderBy, uniqBy } from "lodash";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useSWRConfig } from "swr";
import {
  airlineFilterOffers_,
  flightOffers_,
  queryParams_,
  stopsFilterOffers_,
} from "../../lib/recoil";
import { titleCase } from "../../lib/utility";

export default function AirlineFilter() {
  const { cache } = useSWRConfig();
  const queryParams = useRecoilValue(queryParams_);
  const setOffers = useSetRecoilState(flightOffers_);
  const [airlineFilterOffers, setAirlineFilterOffers] =
    useRecoilState(airlineFilterOffers_);
  const stopsOffers = useRecoilValue(stopsFilterOffers_);

  const [selectAll, setSelectAll] = React.useState(true);
  const flightOffers = get(
    cache.get(JSON.stringify(queryParams)),
    "data.data",
    []
  );

  console.log("airlineFilterOffers", airlineFilterOffers);

  const [airlines, setAirlines] = React.useState([
    { iataCode: "", status: true, name: "" },
  ]);
  const handleChange = (airline) => {
    console.log("target", airline);
    const newAirlines = airlines.map((airlineInfo) => {
      if (airlineInfo.iataCode === airline.iataCode) {
        return { ...airlineInfo, status: !airlineInfo.status };
      } else {
        return { ...airlineInfo };
      }
    });
    setAirlines([...newAirlines]);
  };

  React.useEffect(() => {
    const carriers = get(
      cache.get(JSON.stringify(queryParams)),
      "data.dictionaries.carriers",
      {}
    );

    const defaultAirlines = Object.entries(carriers).map((carrier) => ({
      name: carrier[1],
      iataCode: carrier[0],
      status: true,
    }));

    setAirlines([...defaultAirlines]);
  }, [JSON.stringify(flightOffers)]);

  React.useEffect(() => {
    console.time("airlineT");
    const newOffers = filter(flightOffers, (flightOffer) => {
      let included = [];
      forEach(get(flightOffer, "itineraries", []), (itinerary) => {
        forEach(get(itinerary, "segments", []), (segment) => {
          const selectedAirlines = filter(
            airlines,
            (airline) => airline.status
          );
          //  console.log("selectedAirlines", selectedAirlines);
          included.push(
            selectedAirlines
              .map((airline) => airline.iataCode)
              .includes(get(segment, "carrierCode", ""))
          );
          included.push(
            selectedAirlines
              .map((airline) => airline.iataCode)
              .includes(get(segment, "operating.carrierCode", ""))
          );
        });
      });
      //   console.log("included", included);
      return included.includes(true);
    });
    console.timeEnd("airlineT");
    //  console.log("newOffers", newOffers, airlines);
    // @ts-ignore
    setAirlineFilterOffers(newOffers);
  }, [JSON.stringify(airlines)]);

  const deselectAll = () => {
    const newAirlines = airlines.map((airline) => ({
      ...airline,
      status: false,
    }));
    setAirlines([...newAirlines]);
    setSelectAll(false);
  };

  const runSelectAll = () => {
    const newAirlines = airlines.map((airline) => ({
      ...airline,
      status: true,
    }));
    setAirlines([...newAirlines]);
    setSelectAll(true);
  };

  React.useEffect(() => {
    const allOffers = orderBy(
      uniqBy(
        [...airlineFilterOffers, ...stopsOffers].map((offer) => ({
          ...offer,
          id: Number(offer.id),
        })),
        "id"
      ),
      ["id"],
      ["asc"]
    ).map((offer) => ({
      ...offer,
      id: `${offer.id}`,
    }));

    // @ts-ignore
    setOffers(allOffers);

    //  console.log("allOffers", airlineFilterOffers, stopsOffers, allOffers);
  }, [JSON.stringify(airlineFilterOffers), JSON.stringify(stopsOffers)]);

  return (
    <Stack sx={{ pr: 1 }}>
      <FormControl required>
        <Stack justifyContent="space-between" direction="row">
          <Typography variant="caption">Airlines</Typography>
          {selectAll ? (
            <Link
              sx={{ cursor: "pointer" }}
              onClick={deselectAll}
              variant="caption"
            >
              Deselect All
            </Link>
          ) : (
            <Link
              sx={{ cursor: "pointer" }}
              onClick={runSelectAll}
              variant="caption"
            >
              Select All
            </Link>
          )}
        </Stack>
        <FormGroup>
          {airlines.map((airline, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={airline.status}
                  onChange={(e) => handleChange(airline)}
                  name={airline.name}
                  size="small"
                />
              }
              label={
                <Typography variant="caption">
                  {titleCase(airline.name)}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    </Stack>
  );
}
