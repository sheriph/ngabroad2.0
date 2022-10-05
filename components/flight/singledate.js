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
import { dates_ } from "../../lib/recoil";

export default function Dates({ item }) {
  const [dates, setDates] = React.useState(
    Array.from({ length: 10 }, (_, i) => new Date())
  );

  const [storeDates, setStoreDates] = useRecoilState(dates_);

  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  console.log("storeDates", storeDates[item]);

  const onChange = (date) => {
    let newDates = [...dates];
    newDates[item] = date;
    setDates(newDates);
    setStoreDates(newDates);
  };

  // @ts-ignore
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => {
    //const [a, b] = value.split("-");

    return (
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        component={Paper}
        variant="outlined"
        onClick={onClick}
        ref={ref}
        sx={{ cursor: "pointer" }}
      >
        <Stack spacing={1} sx={{ p: 1 }} direction="row">
          <Typography sx={{ color: "text.disabled" }}>Depart</Typography>
          <Typography>{dayjs(storeDates[item]).format("ddd MMM D")}</Typography>
        </Stack>
      </Stack>
    );
  });

  return (
    <ReactDatePicker
      selected={dates[item]}
      onChange={onChange}
      customInput={<CustomInput />}
      withPortal={mobile}
      minDate={new Date()}
      maxDate={
        new Date(
          new Date(new Date()).getFullYear(),
          new Date(new Date()).getMonth(),
          new Date(new Date()).getDate() + 365
        )
      }
      //   inline
    />
  );
}
