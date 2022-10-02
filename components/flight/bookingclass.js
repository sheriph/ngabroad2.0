import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Typography, useMediaQuery } from "@mui/material";
import { useRecoilState } from "recoil";
import { class_ } from "../../lib/recoil";

export default function BookingClass() {
  const [value, setValue] = useRecoilState(class_);
  // @ts-ignore
  const mobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const handleChange = (event) => setValue(event.target.value);

  return (
    <FormControl>
      <Typography sx={{ pl: 2, fontWeight: "bold", mb: 1 }}>Classes</Typography>
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
          value="economy"
          control={<Radio />}
          label="Economy"
        />

        <FormControlLabel
          sx={{ justifyContent: "space-between" }}
          labelPlacement="start"
          value="premium_economy"
          control={<Radio />}
          label="Premium Economy"
        />
        <FormControlLabel
          sx={{ justifyContent: "space-between" }}
          labelPlacement="start"
          value="business"
          control={<Radio />}
          label="Business"
        />
        <FormControlLabel
          sx={{ justifyContent: "space-between" }}
          labelPlacement="start"
          value="first"
          control={<Radio />}
          label="First Class"
        />
      </RadioGroup>
    </FormControl>
  );
}
