import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Typography } from "@mui/material";

export default function BookingClass() {
  const [value, setValue] = React.useState("economy");

  const handleChange = (event) => setValue(event.target.value);

  return (
    <FormControl sx={{ width: { xs: "80%", md: "200px" } }}>
      <Typography sx={{ pl: 2, fontWeight: "bold", mb: 2 }}>Classes</Typography>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
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
