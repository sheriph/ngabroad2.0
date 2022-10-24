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
import DatePicker from "react-datepicker";

export default function PassportExpiryDate({ value, onChange }) {
  // const [value, onChange] = React.useState(new Date());

  console.log("storeDates", value);

  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  // @ts-ignore
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => {
    //const [a, b] = value.split("-");

    return (
      <Stack
        direction="row"
        component={Paper}
        variant="outlined"
        onClick={onClick}
        ref={ref}
        sx={{
          cursor: "pointer",
          p: 1,
          pl: 1.5,
          height: "37px",
          borderRadius: 2,
          color: "inherit",
          position: "relative",
        }}
      >
        {dayjs(value).format("YYYY-MM-DD") !== dayjs().format("YYYY-MM-DD") ? (
          <Typography
            sx={{
              position: "absolute",
              bottom: 28,
              fontSize: "0.75em",
              backgroundColor: "white",
              px: 0.4,
              left: 9,
              color: (t) => t.palette.text.secondary,
            }}
            variant="caption"
          >
            Expiry Date
          </Typography>
        ) : (
          ""
        )}
        <Typography sx={{ fontSize: "0.80rem", position: "absolute", top: 9 }}>
          {dayjs(value).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
            ? "Expiry Date"
            : dayjs(value).format("DD MMMM YYYY")}
        </Typography>
      </Stack>
    );
  });

  return (
    <DatePicker
      selected={value}
      // @ts-ignore
      onChange={(date) => onChange(date)}
      // peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      customInput={<CustomInput />}
      withPortal={mobile}
      showPreviousMonths={false}
      minDate={new Date()}
    />
  );
}
