import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import useSWRImmutable from "swr/immutable";
import {
  Box,
  ClickAwayListener,
  LinearProgress,
  Popper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { debounce, fill, get } from "lodash";
import { titleCase } from "../../lib/utility";
import LocalAirportOutlinedIcon from "@mui/icons-material/LocalAirportOutlined";
import { alpha } from "@mui/material/styles";
import { useRecoilState } from "recoil";
import { locations_ } from "../../lib/recoil";
import axios from "axios";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import FlightLandOutlinedIcon from "@mui/icons-material/FlightLandOutlined";

const getLocations = async (key) => {
  try {
    const locations = await axios.post("/api/flights/locations", {
      keyword: key,
    });
    console.log("locations.data", locations.data);
    return locations.data;
  } catch (error) {
    console.log("error", error.response);
    throw new Error(error.response);
  }
};

export default function Locations({ index }) {
  const point = !Boolean(index % 2) ? (
    <FlightTakeoffOutlinedIcon />
  ) : (
    <FlightLandOutlinedIcon />
  );
  const container = React.useRef(null);
  const [locations, setLocations] = useRecoilState(locations_);
  const [inputOpen, setInputOpen] = React.useState(false);
  const [userQuery, setUserQuery] = React.useState("");
  const [text, setText] = React.useState("");
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });
  const {
    data: searchResult,
    error,
    isLoading,
  } = useSWRImmutable(text, getLocations, {
    keepPreviousData: true,
    shouldRetryOnError: true,
    errorRetryCount: 1,
  });

  console.log("searchResult", searchResult, error);

  const updateQuery = () => {
    // A search query api call.
    setText(userQuery);
  };

  const delayedQuery = React.useCallback(debounce(updateQuery, 500), [
    userQuery,
  ]);

  const updateText = (e) => {
    setUserQuery(e.target.value);
  };

  React.useEffect(() => {
    delayedQuery();

    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel;
  }, [userQuery, delayedQuery]);

  console.log("locations", locations);

  return (
    <ClickAwayListener onClickAway={() => setInputOpen(false)}>
      <Box
        // @ts-ignore
        sx={{
          backgroundColor: "background.paper",
          border: inputOpen ? 0 : 1,
          borderRadius: 1,
          borderBottomRightRadius: inputOpen && 0,
          borderBottomLeftRadius: inputOpen && 0,
          boxShadow:
            inputOpen &&
            "rgba(60, 64, 67, 0.9) 0px 1px 2px 0px, rgba(60, 64, 67, 0.43) 0px 1px 3px 1px",
          borderColor: "grey.300",
          //    transition: "box-shadow 5s",

          // borderBottom: inputOpen ? 0 : 1,
        }}
        // elevation={inputOpen ? 15 : 0}
        width="100%"
      >
        <Stack
          divider={<Divider orientation="vertical" flexItem />}
          // component={Paper}
          // variant="outlined"
          sx={{ cursor: "pointer" }}
          //  aria-describedby={id}
          ref={container}
        >
          <Stack>
            <Stack
              alignItems="center"
              spacing={1}
              sx={{ p: 1, height: 40 }}
              direction="row"
            >
              <Typography sx={{ color: "text.disabled" }}>{point}</Typography>
              <InputBase
                placeholder={
                  !Boolean(index % 2)
                    ? "Seach departure city"
                    : "Search arrival city"
                }
                onFocus={() => setInputOpen(true)}
                // onBlur={() => setInputOpen(false)}
                value={locations[index].prettyText}
                onChange={(e) => {
                  const update = { prettyText: e.target.value, data: null };
                  setLocations((prev) =>
                    fill([...prev], update, index, index + 1)
                  );
                  updateText(e);
                }}
                fullWidth
                sx={{
                  ml: 1,
                  "& .MuiInputBase-input": { textOverflow: "ellipsis" },
                }}
                inputProps={{
                  "aria-label": "search google maps",
                  onClick: (e) => e.currentTarget.select(),
                }}
              />
            </Stack>
          </Stack>
          {isLoading && <LinearProgress />}
        </Stack>
        <Popper
          sx={{
            width: { md: 400 },
            zIndex: (t) => t.zIndex.drawer + 1,
          }}
          anchorEl={container.current}
          open={inputOpen}
          // transition
          popperOptions={{
            placement: "bottom-start",
          }}
          modifiers={[
            {
              name: "matchReferenceSize",
              enabled: true,
              fn: ({ state, instance }) => {
                const widthOrHeight =
                  state.placement.startsWith("left") ||
                  state.placement.startsWith("right")
                    ? "height"
                    : "width";
                const popperSize = state.rects.popper[widthOrHeight];
                const referenceSize = state.rects.reference[widthOrHeight];
                if (popperSize >= referenceSize) return;

                state.styles.popper[widthOrHeight] = `${referenceSize}px`;
                instance.update();
              },
              phase: "beforeWrite",
              requires: ["computeStyles"],
            },
          ]}
        >
          <Stack
            spacing={1}
            sx={{
              backgroundColor: "background.paper",
              borderTop: 0,
              boxShadow:
                "rgba(0, 0, 0, 0.55) 0px 1px 1px,rgba(0, 0, 0, 0.07) 0px 2px 2px,rgba(0, 0, 0, 0.07) 0px 4px 4px,rgba(0, 0, 0, 0.19) 0px 8px 8px,rgba(0, 0, 0, 0.07) 0px 16px 16px",
            }}
          >
            {get(searchResult, "data", []).map((value, key) => (
              <Stack
                key={key}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "grey.200" },
                }}
                alignItems="center"
                spacing={1}
                direction="row"
                onClick={() => {
                  console.log("close");
                  const prettyText =
                    value?.subType === "CITY"
                      ? titleCase(
                          `${value?.address?.cityName}, ${value?.address?.countryName}`
                        )
                      : `${titleCase(value?.address?.cityName)}, ${
                          value?.iataCode
                        }`;

                  const update = { prettyText: prettyText, data: value };
                  setLocations((prev) =>
                    fill([...prev], update, index, index + 1)
                  );
                  // setText({ prettyText, data: value });
                  setTimeout(() => setInputOpen(false), 0);
                }}
              >
                {value?.subType === "CITY" ? (
                  <IconButton>
                    <LocationCityOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton>
                    <LocalAirportOutlinedIcon />
                  </IconButton>
                )}
                {value?.subType === "CITY" ? (
                  <Typography flexGrow={1}>
                    {titleCase(
                      `${value?.address?.cityName}, ${value?.address?.countryName}`
                    )}
                  </Typography>
                ) : (
                  <Typography flexGrow={1}>{titleCase(value?.name)}</Typography>
                )}
                <IconButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: (t) => alpha(t.palette.primary.main, 0.15),
                    width: 25,
                    height: 25,
                    mr: "8px !important",
                  }}
                  color="primary"
                  size="small"
                >
                  <AddOutlinedIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

const res = {
  meta: {
    count: 6,
    links: {
      self: "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=manc",
    },
  },
  data: [
    {
      type: "location",
      subType: "CITY",
      name: "MANCHESTER",
      detailedName: "MANCHESTER/GB",
      id: "CMAN",
      self: {
        href: "https://test.api.amadeus.com/v1/reference-data/locations/CMAN",
        methods: ["GET"],
      },
      timeZoneOffset: "+01:00",
      iataCode: "MAN",
      geoCode: {
        latitude: 53.35362,
        longitude: -2.275,
      },
      address: {
        cityName: "MANCHESTER",
        cityCode: "MAN",
        countryName: "UNITED KINGDOM",
        countryCode: "GB",
        regionCode: "EUROP",
      },
      analytics: {
        travelers: {
          score: 17,
        },
      },
    },
    {
      type: "location",
      subType: "AIRPORT",
      name: "MANCHESTER AIRPORT",
      detailedName: "MANCHESTER/GB:MANCHESTER AIRPO",
      id: "AMAN",
      self: {
        href: "https://test.api.amadeus.com/v1/reference-data/locations/AMAN",
        methods: ["GET"],
      },
      timeZoneOffset: "+01:00",
      iataCode: "MAN",
      geoCode: {
        latitude: 53.35362,
        longitude: -2.275,
      },
      address: {
        cityName: "MANCHESTER",
        cityCode: "MAN",
        countryName: "UNITED KINGDOM",
        countryCode: "GB",
        regionCode: "EUROP",
      },
      analytics: {
        travelers: {
          score: 17,
        },
      },
    },
    {
      type: "location",
      subType: "CITY",
      name: "MANCHESTER",
      detailedName: "MANCHESTER/NH/US",
      id: "CMHT",
      self: {
        href: "https://test.api.amadeus.com/v1/reference-data/locations/CMHT",
        methods: ["GET"],
      },
      timeZoneOffset: "-04:00",
      iataCode: "MHT",
      geoCode: {
        latitude: 42.9325,
        longitude: -71.43555,
      },
      address: {
        cityName: "MANCHESTER",
        cityCode: "MHT",
        countryName: "UNITED STATES OF AMERICA",
        countryCode: "US",
        stateCode: "NH",
        regionCode: "NAMER",
      },
      analytics: {
        travelers: {
          score: 2,
        },
      },
    },
    {
      type: "location",
      subType: "AIRPORT",
      name: "MANCHESTER BOSTON RGNL",
      detailedName: "MANCHESTER/NH/US:MANCHESTER BO",
      id: "AMHT",
      self: {
        href: "https://test.api.amadeus.com/v1/reference-data/locations/AMHT",
        methods: ["GET"],
      },
      timeZoneOffset: "-04:00",
      iataCode: "MHT",
      geoCode: {
        latitude: 42.9325,
        longitude: -71.43555,
      },
      address: {
        cityName: "MANCHESTER",
        cityCode: "MHT",
        countryName: "UNITED STATES OF AMERICA",
        countryCode: "US",
        stateCode: "NH",
        regionCode: "NAMER",
      },
      analytics: {
        travelers: {
          score: 2,
        },
      },
    },
    {
      type: "location",
      subType: "CITY",
      name: "INGOLSTADT",
      detailedName: "INGOLSTADT/DE",
      id: "CIGS",
      self: {
        href: "https://test.api.amadeus.com/v1/reference-data/locations/CIGS",
        methods: ["GET"],
      },
      timeZoneOffset: "+02:00",
      iataCode: "IGS",
      geoCode: {
        latitude: 48.72334,
        longitude: 11.54028,
      },
      address: {
        cityName: "INGOLSTADT",
        cityCode: "IGS",
        countryName: "GERMANY",
        countryCode: "DE",
        regionCode: "EUROP",
      },
    },
    {
      type: "location",
      subType: "AIRPORT",
      name: "MANCHING",
      detailedName: "INGOLSTADT/DE:MANCHING",
      id: "AIGS",
      self: {
        href: "https://test.api.amadeus.com/v1/reference-data/locations/AIGS",
        methods: ["GET"],
      },
      timeZoneOffset: "+02:00",
      iataCode: "IGS",
      geoCode: {
        latitude: 48.72334,
        longitude: 11.54028,
      },
      address: {
        cityName: "INGOLSTADT",
        cityCode: "IGS",
        countryName: "GERMANY",
        countryCode: "DE",
        regionCode: "EUROP",
      },
    },
  ],
};
