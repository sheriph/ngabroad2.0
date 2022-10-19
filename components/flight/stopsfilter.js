import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import Radio from "@mui/material/Radio";
import {
  airlineFilterOffers_,
  flightOffers_,
  queryParams_,
  stopsFilterOffers_,
} from "../../lib/recoil";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useSWRConfig } from "swr";
import { filter, find, forEach, get, orderBy, uniqBy } from "lodash";
import { getStops } from "../../lib/utility";

export default function StopsFilter() {
  const [value, setValue] = React.useState({ label: "Any", value: -1 });
  const [stops, setStops] = React.useState([{ label: "Any", value: -1 }]);
  const queryParams = useRecoilValue(queryParams_);
  const setOffers = useSetRecoilState(flightOffers_);
  const [stopsOffers, setStopsFilterOffers] =
    useRecoilState(stopsFilterOffers_);
  const airlineFilterOffers = useRecoilValue(airlineFilterOffers_);
  const { cache } = useSWRConfig();

  const flightOffers = get(
    cache.get(JSON.stringify(queryParams)),
    "data.data",
    []
  );

  const handleChange = (event) => {
    setValue(JSON.parse(event.target.value));
  };

  //getStops(get(itinerary, "segments", []).length - 1)

  React.useEffect(() => {
    const newStops = [{ label: "Any", value: -1 }];
    forEach(flightOffers, (flightOffer, index, arr) => {
      forEach(get(flightOffer, "itineraries", []), (itinerary, index, arr2) => {
        const stop = {
          label: getStops(get(itinerary, "segments", []).length - 1),
          value: get(itinerary, "segments", []).length - 1,
        };
        newStops.push(stop);
      });
    });
    setStops(orderBy(uniqBy(newStops, "label"), ["value"], ["asc"]));
  }, [JSON.stringify(flightOffers)]);

  React.useEffect(() => {
    console.time("stopsT");
    const newOffers = filter(flightOffers, (offer, index, arr) => {
      if (value.value < 0) return true;
      const newStops = [{ label: "Any", value: -1 }];
      forEach(get(offer, "itineraries", []), (itinerary, index, arr2) => {
        const stop = {
          label: getStops(get(itinerary, "segments", []).length - 1),
          value: get(itinerary, "segments", []).length - 1,
        };
        newStops.push(stop);
      });
      //  console.log("newStops", newStops);
      return Boolean(find(newStops, (stop) => stop.value === value.value));
    });
    //   console.timeEnd("stopsT");
    //  console.log("newOffers", newOffers);
    // @ts-ignore
    //setOffers(newOffers);
    setStopsFilterOffers(newOffers);
  }, [JSON.stringify(value)]);

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

    console.log("allOffers", airlineFilterOffers, stopsOffers, allOffers);
  }, [JSON.stringify(airlineFilterOffers), JSON.stringify(stopsOffers)]);

  console.log("stopsOffers", stopsOffers);

  return (
    <Stack>
      <FormControl>
        <Typography variant="caption">Stops</Typography>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="Any"
          name="radio-buttons-group"
          value={JSON.stringify(value)}
          onChange={handleChange}
        >
          {stops.map((stop, index) => (
            <FormControlLabel
              key={index}
              value={JSON.stringify(stop)}
              control={<Radio size="small" />}
              label={<Typography variant="caption">{stop.label}</Typography>}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
