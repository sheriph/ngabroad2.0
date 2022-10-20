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
import { queryParams_, stopFilterValue_ } from "../../lib/recoil";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useSWRConfig } from "swr";
import { forEach, get, orderBy, uniqBy } from "lodash";
import { getStops } from "../../lib/utility";

export default function StopsFilter() {
  const [stopValue, setValue] = useRecoilState(stopFilterValue_);
  const [stops, setStops] = React.useState([{ label: "Any", value: -1 }]);
  const queryParams = useRecoilValue(queryParams_);
  const { cache } = useSWRConfig();

  const flightOffers = get(
    cache.get(JSON.stringify(queryParams)),
    "data.data",
    []
  );
  const handleChange = (event) => {
    setValue(JSON.parse(event.target.value));
  };

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

  return (
    <Stack>
      <FormControl>
        <Typography variant="caption">Stops</Typography>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="Any"
          name="radio-buttons-group"
          value={JSON.stringify(stopValue)}
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
