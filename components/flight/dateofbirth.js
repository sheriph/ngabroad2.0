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

export default function DateOfBirth({ minAge = 1200, maxAge = 12 }) {
  const [startDate, setStartDate] = React.useState(new Date());

  console.log("storeDates", startDate);

  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

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
        sx={{
          cursor: "pointer",
          p: 1,
          pl: 1.5,
          height: "37px",
          borderRadius: 2,
          color: "inherit",
        }}
      >
        <Typography>{dayjs(value).format("DD MMMM YYYY")}</Typography>
      </Stack>
    );
  });

  return (
    <DatePicker
      selected={startDate}
      // @ts-ignore
      onChange={(date) => setStartDate(date)}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      customInput={<CustomInput />}
      withPortal={mobile}
      minDate={dayjs().subtract(minAge, "months").toDate()}
      maxDate={dayjs().subtract(maxAge, "months").toDate()}
    />
  );
}
