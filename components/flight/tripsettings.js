import {
  Button,
  ButtonGroup,
  Drawer,
  Grid,
  Stack,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import AirlineSeatReclineExtraOutlinedIcon from "@mui/icons-material/AirlineSeatReclineExtraOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { truncate } from "lodash";
import Trip from "./trip";
import BookingClass from "./bookingclass";
import Passengers from "./passengers";
import { useRecoilValue } from "recoil";
import { class_, passengers_, trip_ } from "../../lib/recoil";
import { prettyClass, prettyTrip } from "../../lib/utility";

export default function TripSettings() {
  // @ts-ignore
  const mobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [drawerState, setDrawerState] = React.useState(false);
  const trip = useRecoilValue(trip_);
  const passengers = useRecoilValue(passengers_);
  const bookingClass = useRecoilValue(class_);

  return (
    <Stack>
      <ButtonGroup
        onClick={() => setDrawerState(true)}
        size="small"
        aria-label="small button group"
        variant="text"
      >
        <Button
          disableFocusRipple
          disableRipple
          disableTouchRipple
          startIcon={<SwapHorizOutlinedIcon />}
        >
          {prettyTrip(trip)}
        </Button>
        <Button
          disableFocusRipple
          disableRipple
          disableTouchRipple
          startIcon={<AirlineSeatReclineExtraOutlinedIcon />}
        >
          {truncate(prettyClass(bookingClass), {
            length: mobile ? 6 : 100,
            omission: "..",
          })}
        </Button>
        <Button
          disableFocusRipple
          disableRipple
          disableTouchRipple
          startIcon={<PeopleAltOutlinedIcon />}
        >
          {Object.values(passengers).reduce((a, b) => a + b, 0)}
        </Button>
      </ButtonGroup>
      <Drawer
        anchor="bottom"
        open={drawerState}
        onClose={() => setDrawerState((prev) => !prev)}
      >
        <Stack sx={{ p: 2 }}>
          <Grid spacing={2} container>
            <Grid xs={12} sm={6} md={3} item>
              <Trip />
            </Grid>
            <Grid xs={12} sm={6} md={3} item>
              <BookingClass />
            </Grid>
            <Grid xs={12} sm={6} md={6} item>
              <Passengers />
            </Grid>
          </Grid>
          <Stack
            sx={{ mt: 2, display: { xs: "flex", md: "none" } }}
            justifyContent="center"
          >
            <Button
              onClick={() => setDrawerState(false)}
              size="small"
              variant="outlined"
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
}
