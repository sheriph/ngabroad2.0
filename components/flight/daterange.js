import {
  Box,
  ClickAwayListener,
  Divider,
  Paper,
  Popper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import ReactDatePicker from "react-datepicker";
import { useRecoilState } from "recoil";
import { endDate_, startDate_ } from "../../lib/recoil";

export default function DateRange() {
  const [startDate, setStartDate] = useRecoilState(startDate_);
  const [endDate, setEndDate] = useRecoilState(endDate_);

  console.log("startDate", startDate);

  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // @ts-ignore
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => {
    //  const [a, b] = value.split("-");

    return (
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        // component={Paper}
        // variant="outlined"
        onClick={onClick}
        ref={ref}
        sx={{
          cursor: "pointer",
          height: 40,
          backgroundColor: "background.paper",
          border: 1,
          borderColor: "grey.300",
          borderRadius: 1,
        }}
      >
        <Stack spacing={1} sx={{ p: 1, width: "50%" }} direction="row">
          <Typography sx={{ color: "text.disabled" }}>Depart</Typography>
          <Typography sx={{ overflow: "hidden" }}>
            {dayjs(startDate).format("ddd MMM D")}
          </Typography>
        </Stack>
        <Stack spacing={1} sx={{ p: 1, width: "50%" }} direction="row">
          {dayjs(endDate).isValid() && (
            <Typography sx={{ color: "text.disabled" }}>Return</Typography>
          )}
          <Typography sx={{ overflow: "hidden" }}>
            {dayjs(endDate).isValid() ? (
              dayjs(endDate).format("ddd MMM D")
            ) : (
              <Typography component="span" sx={{ color: "text.disabled" }}>
                Selecting Return ?
              </Typography>
            )}
          </Typography>
        </Stack>
      </Stack>
    );
  });

  return (
    <ReactDatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      customInput={<CustomInput />}
      selectsRange
      withPortal={mobile}
      minDate={new Date()}
      monthsShown={mobile ? 1 : 2}
      maxDate={dayjs(startDate).add(365, "day").toDate()}
      //   inline
    >
      <Typography
        sx={{
          color: "primary.main",
          position: "absolute",
          display: "block",
          textAlign: "center",
          left: 0,
          right: 0,
          bottom: 0,
        }}
        variant="caption"
      >
        {!dayjs(startDate).isValid() && "Select a Departure Date"}
        {" - "}
        {!dayjs(endDate).isValid() && "Select a Return Date"}
      </Typography>
    </ReactDatePicker>
  );
}
