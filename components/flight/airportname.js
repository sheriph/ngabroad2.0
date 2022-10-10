import { Skeleton, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { get, truncate } from "lodash";
import React from "react";
import useSWRImmutable from "swr/immutable";
import { titleCase } from "../../lib/utility";

const getLocationName = async (iataCode) => {
  try {
    const name = await axios.post("/api/flights/locationname", {
      iataCode,
    });

    return get(name, "data.data", null);
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};

export default function LocationName({ iataCode, isAirport }) {
  const { data, isLoading } = useSWRImmutable(iataCode, getLocationName, {
    keepPreviousData: true,
  });

  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  console.log("iataCode", data, iataCode, isLoading);

  if (!data) return <React.Fragment></React.Fragment>;

  return (
    <React.Fragment>
      {isAirport ? (
        <Typography component="span" variant="caption">
          {truncate(
            `${titleCase(get(data, "name", ""))}, ${titleCase(
              get(data, "address.cityName", "")
            )} (${get(data, "iataCode", "")})`,
            { length: mobile ? 45 : 500 }
          )}
        </Typography>
      ) : (
        <Typography component="span" variant="caption">{`${titleCase(
          get(data, "address.cityName", "")
        )}`}</Typography>
      )}
    </React.Fragment>
  );
}
