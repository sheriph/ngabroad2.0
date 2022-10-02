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

export default function TripSettings() {
  // @ts-ignore
  const mobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [drawerState, setDrawerState] = React.useState(false);

  return (
    <Stack>
      <ButtonGroup size="small" aria-label="small button group">
        <Button onClick={() => setDrawerState(true)} color="info">
          <SettingsOutlinedIcon />
        </Button>
        <Button
          disableFocusRipple
          disableRipple
          disableTouchRipple
          startIcon={<SwapHorizOutlinedIcon />}
        >
          Return
        </Button>
        <Button
          disableFocusRipple
          disableRipple
          disableTouchRipple
          startIcon={<AirlineSeatReclineExtraOutlinedIcon />}
        >
          {truncate("Premium Economy", {
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
          3
        </Button>
      </ButtonGroup>
      <Drawer
        anchor="bottom"
        open={drawerState}
        onClose={() => setDrawerState((prev) => !prev)}
      >
        <Stack spacing={2} sx={{ p: 2 }}>
          <Grid spacing={2} container>
            <Grid xs={12} sm={6} md={4} item>
              <Trip />
            </Grid>
            <Grid xs={12} sm={6} md={4} item>
              <BookingClass />
            </Grid>
            <Grid xs={12} sm={6} md={4} item>
              <Passengers />
            </Grid>
          </Grid>
          <Stack spacing={4} justifyContent="center" direction="row">
            <Button size="small" variant="contained">
              Cancel
            </Button>
            <Button size="small" variant="contained">
              Apply
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
}
