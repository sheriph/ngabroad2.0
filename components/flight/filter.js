import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Stack,
} from "@mui/material";
import React from "react";
import Radio from "@mui/material/Radio";
import { queryParams_ } from "../../lib/recoil";
import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";
import { forEach, get, orderBy, uniqBy } from "lodash";
import { getStops } from "../../lib/utility";

export default function FlightFilter() {
  const [value, setValue] = React.useState({ label: "Any", value: -1 });
  const [stops, setStops] = React.useState([{ label: "Any", value: -1 }]);
  const queryParams = useRecoilValue(queryParams_);
  const { cache } = useSWRConfig();

  const flightOffers = get(
    cache.get(JSON.stringify(queryParams)),
    "data.data",
    null
  );

  console.log("flightOffers in cache stops", flightOffers, stops, value);

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
  }, [null]);

  return (
    <Stack>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Stops</FormLabel>
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
              label={stop.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
