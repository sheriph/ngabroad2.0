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
import { useRecoilValue } from "recoil";
import {
  class_,
  dates_,
  endDate_,
  locations_,
  passengers_,
  startDate_,
  trip_,
} from "../../lib/recoil";
import { initial, last, uniqueId } from "lodash";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddLocationOutlinedIcon from "@mui/icons-material/AddLocationOutlined";

export default function FlightSearchForm() {
  const trip = useRecoilValue(trip_);
  const classOfBooking = useRecoilValue(class_);
  const passengers = useRecoilValue(passengers_);
  const startDate = useRecoilValue(startDate_);
  const endDate = useRecoilValue(endDate_);
  const dates = useRecoilValue(dates_);
  const locations = useRecoilValue(locations_);
  const [multiCity, setMultiCity] = React.useState([{ a: 0, b: 1 }]);

  console.log("multiCity", multiCity);

  console.log(
    "values",
    trip,
    //  classOfBooking,
    //   passengers,
    //   startDate,
    //   endDate,
    dates,
    locations
  );
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
            const id = uniqueId("multi");
            console.log("id", id);
            return (
              <Grid key={id} item xs={12} sx={{ mb: 1 }} container>
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
              <IconButton
                onClick={() =>
                  // @ts-ignore
                  setMultiCity((prev) => [
                    ...prev,
                    // @ts-ignore
                    { a: last(prev)?.a + 2, b: last(prev)?.b + 2 },
                  ])
                }
                color="primary"
              >
                <AddLocationOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid item xs="auto">
              <IconButton
                // @ts-ignore
                onClick={() =>
                  multiCity.length > 1 &&
                  setMultiCity((prev) => initial([...prev]))
                }
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
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
