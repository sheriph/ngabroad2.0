import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { get } from "lodash";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useSWRConfig } from "swr";
import { airlinesFilter_, flightOffers_, queryParams_ } from "../../lib/recoil";
import { titleCase } from "../../lib/utility";

export default function AirlineFilter() {
  const { cache } = useSWRConfig();
  const queryParams = useRecoilValue(queryParams_);
  const [selectAll, setSelectAll] = React.useState(true);
  const flightOffers = useRecoilValue(flightOffers_);

  const [airlines, setAirlines] = useRecoilState(airlinesFilter_);

  const handleChange = (airline) => {
    const newAirlines = airlines.map((airlineInfo) => {
      // @ts-ignore
      if (airlineInfo.iataCode === airline.iataCode) {
        // @ts-ignore
        return { ...airlineInfo, status: !airlineInfo.status };
      } else {
        // @ts-ignore
        return { ...airlineInfo };
      }
    });
    //   console.log("target", airline, newAirlines);

    // @ts-ignore
    setAirlines([...newAirlines]);
  };

  React.useEffect(() => {
    const carriers = get(flightOffers, "dictionaries.carriers", {});
    const defaultAirlines = Object.entries(carriers).map((carrier) => ({
      name: carrier[1],
      iataCode: carrier[0],
      status: true,
    }));

    // @ts-ignore
    setAirlines([...defaultAirlines]);
  }, [JSON.stringify(flightOffers)]);

  const deselectAll = () => {
    const newAirlines = airlines.map((airline) => ({
      // @ts-ignore
      ...airline,
      status: false,
    }));
    // @ts-ignore
    setAirlines([...newAirlines]);
    setSelectAll(false);
  };

  const runSelectAll = () => {
    const newAirlines = airlines.map((airline) => ({
      // @ts-ignore
      ...airline,
      status: true,
    }));
    // @ts-ignore
    setAirlines([...newAirlines]);
    setSelectAll(true);
  };

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
                  // @ts-ignore
                  checked={airline.status}
                  // @ts-ignore
                  onChange={(e) => handleChange(airline)}
                  // @ts-ignore
                  name={airline.name}
                  size="small"
                />
              }
              label={
                <Typography variant="caption">
                  {titleCase(
                    // @ts-ignore
                    airline.name
                  )}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    </Stack>
  );
}
