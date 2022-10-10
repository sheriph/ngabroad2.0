import {
  Box,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Image from "next/image";
import { alpha } from "@mui/material/styles";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  class_,
  dates_,
  endDate_,
  locations_,
  multiCity_,
  passengers_,
  queryParams_,
  startDate_,
  trip_,
} from "../../lib/recoil";
import { first, get, last, uniq } from "lodash";
import { getStops } from "../../lib/utility";
import dayjs from "dayjs";
import LocationName from "./airportname";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";

export default function SegmentCard({ segment }) {
  const trip = useRecoilValue(trip_);
  const classOfBooking = useRecoilValue(class_);
  const passengers = useRecoilValue(passengers_);
  const startDate = useRecoilValue(startDate_);
  const endDate = useRecoilValue(endDate_);
  const [dates, setDates] = useRecoilState(dates_);
  const [locations, setLocations] = useRecoilState(locations_);
  const [multiCity, setMultiCity] = useRecoilState(multiCity_);
  const [queryParams, setQueryParams] = useRecoilState(queryParams_);
  const [open, setOpen] = React.useState(false);

  const VerticalLine = ({ height = 30 }) => (
    <Box
      sx={{
        //  borderLeft: "0.5px",
        background: (t) => t.palette.grey[500],
        //  borderStyle: "solid",
        height: height,
        width: "1px",
        //  ml: 0.6,
        // mr: 1.6,
        position: "absolute",
        left: 91,
        zIndex: 1,
      }}
    />
  );

  return (
    <Stack>
      <Stack sx={{ p: 1 }}>
        <Typography sx={{ mb: 2 }}>To Dubai</Typography>
        <Stack alignItems="center" direction="row">
          <Box width="60px" />
          <CalendarTodayIcon
            sx={{
              width: 15,
              height: 15,
              mr: 0.8,
              zIndex: 2,
              backgroundColor: "background.default",
            }}
          />
          <Typography sx={{ ml: 1 }} variant="caption">
            Mon Oct 10
          </Typography>
        </Stack>
        <Stack alignItems="center" direction="row">
          <Box width="60px" />
          <VerticalLine />
        </Stack>
      </Stack>
      <Paper sx={{ p: 1 }}>
        <Stack alignItems="center" direction="row">
          <Box width="60px" />
          <VerticalLine />
          <Typography sx={{ ml: 3.7 }} variant="caption">
            Manchester
          </Typography>
        </Stack>
        <Stack alignItems="center" direction="row">
          <Box width="60px">
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              5:43 AM
            </Typography>
          </Box>
          <FiberManualRecordIcon
            sx={{ width: 15, height: 15, mr: 0.8, zIndex: 2 }}
          />
          <Typography sx={{ ml: 1 }} variant="caption">
            Manchester–Boston Regional (MHT)
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          sx={{
            backgroundColor: (t) => alpha(t.palette.secondary.main, 0.3),
            mx: -1,
          }}
        >
          <Box width="60px" />
          <VerticalLine height={60} />
          <Typography sx={{ ml: 4.7 }} variant="caption">
            Economy
          </Typography>
        </Stack>
        <Stack
          sx={{
            mx: -1,
            py: 1,
            pr: 1,
            backgroundColor: (t) => alpha(t.palette.primary.light, 0.2),
          }}
          alignItems="center"
          direction="row"
        >
          <Box width="60px">
            <Box sx={{ ml: 1 }}>
              <Image src={`/airlinelogo/BA16.png`} width="16px" height="16px" />
            </Box>
          </Box>
          <AirplanemodeActiveIcon
            sx={{
              width: 15,
              height: 15,
              mr: 1.8,
              transform: "rotate(180deg)",
              zIndex: 2,
              left: 8,
              position: "relative",
            }}
          />
          <Chip
            sx={{ fontSize: "0.75rem", mr: 1 }}
            size="small"
            color="primary"
            label="Emirates Airline"
          />
          <Box sx={{ flexGrow: 1 }}>
            <Chip
              sx={{
                fontSize: "0.75rem",
                backgroundColor: (t) => alpha(t.palette.primary.light, 0.4),
              }}
              size="small"
              label="3h 20m"
            />
          </Box>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ p: "1px" }}
            size="small"
          >
            <UnfoldLessIcon />
          </IconButton>
        </Stack>

        <Collapse
          sx={{
            backgroundColor: (t) => alpha(t.palette.primary.light, 0.2),
            mx: -1,
          }}
          in={open}
        >
          <Stack alignItems="center" direction="row">
            <Box width="60px" />
            <VerticalLine height={50} />
            <Stack sx={{ width: "100%", px: 1 }}>
              <Typography sx={{ ml: 3.7 }} variant="caption">
                Flight Information:
              </Typography>
              <Stack justifyContent="space-between" direction="row">
                <Typography sx={{ ml: 3.7 }} variant="caption">
                  Operating Airline:
                </Typography>
                <Typography sx={{ ml: 3.7 }} variant="caption">
                  EK18272
                </Typography>
              </Stack>
              <Stack justifyContent="space-between" direction="row">
                <Typography sx={{ ml: 3.7 }} variant="caption">
                  Aircraft:
                </Typography>
                <Typography sx={{ ml: 3.7 }} variant="caption">
                  BA12636
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Collapse>

        <Stack alignItems="center" direction="row">
          <Box width="60px" />
          <VerticalLine height={50} />
          <Typography sx={{ ml: 3.7 }} variant="caption">
            Manchester
          </Typography>
        </Stack>
        <Stack alignItems="center" direction="row">
          <Box width="60px">
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              5:43 AM
            </Typography>
          </Box>
          <FiberManualRecordIcon
            sx={{ width: 15, height: 15, mr: 0.8, zIndex: 2 }}
          />
          <Typography sx={{ ml: 1 }} variant="caption">
            Manchester–Boston Regional (MHT)
          </Typography>
        </Stack>
      </Paper>
      <Stack alignItems="center" direction="row">
        <Box width="60px" />
        <VerticalLine height={50} />
        <Typography sx={{ ml: 3.7 }} variant="caption">
          Manchester
        </Typography>
      </Stack>
    </Stack>
  );
}
