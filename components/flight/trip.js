import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Typography, useMediaQuery } from "@mui/material";
import { useRecoilState } from "recoil";
import { trip_ } from "../../lib/recoil";

export default function Trip() {
  const [value, setValue] = useRecoilState(trip_);
  // @ts-ignore
  const mobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleChange = (event) => setValue(event.target.value);

  return (
    <FormControl>
      <Typography sx={{ pl: 2, fontWeight: "bold" }}>Trip</Typography>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
        row={mobile ? true : false}
      >
        <FormControlLabel
          sx={{
            justifyContent: "space-between",
          }}
          labelPlacement="start"
          value="return"
          control={<Radio />}
          label="Return"
        />

        <FormControlLabel
          sx={{ justifyContent: "space-between" }}
          labelPlacement="start"
          value="one_way"
          control={<Radio />}
          label="One-Way"
        />
        <FormControlLabel
          sx={{ justifyContent: "space-between" }}
          labelPlacement="start"
          value="multi"
          control={<Radio />}
          label="Multi-City"
        />
      </RadioGroup>
    </FormControl>
  );
}
