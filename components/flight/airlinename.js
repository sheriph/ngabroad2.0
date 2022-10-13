import { Skeleton, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { get, truncate } from "lodash";
import React from "react";
import useSWRImmutable from "swr/immutable";
import { titleCase } from "../../lib/utility";

const getLocationName = async (iataCode) => {
  try {
    const name = await axios.post("/api/flights/airlinename", {
      iataCode,
    });

    return name.data;
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};

export default function AirlineName({ iataCode }) {
  const { data, isLoading } = useSWRImmutable(iataCode, getLocationName, {
    keepPreviousData: true,
  });

  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  console.log("iataCode airline", data, iataCode, isLoading);

  if (!data) return <React.Fragment></React.Fragment>;

  return <React.Fragment>{titleCase(data)}</React.Fragment>;
}
