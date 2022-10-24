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

export default function DateOfBirth({ minAge, maxAge, value, onChange }) {
  // const [value, onChange] = React.useState(new Date());

  console.log("storeDates", value);

  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  const invalidDateOfBirth =
    dayjs().subtract(maxAge, "month").diff(dayjs(value), "month", true) < 0;

  console.log("dif", invalidDateOfBirth, minAge / 12, maxAge / 12);

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
        {!invalidDateOfBirth && (
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
            Date of Birth
          </Typography>
        )}
        <Typography sx={{ fontSize: "0.80rem", position: "absolute", top: 9 }}>
          {invalidDateOfBirth
            ? "Date of Birth"
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
      minDate={minAge ? dayjs().subtract(minAge, "month").toDate() : null}
      maxDate={maxAge ? dayjs().subtract(maxAge, "month").toDate() : null}
    />
  );
}
