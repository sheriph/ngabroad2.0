import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Typography } from "@mui/material";

export default function Trip() {
  const [value, setValue] = React.useState("return");

  const handleChange = (event) => setValue(event.target.value);

  return (
    <FormControl sx={{ width: { xs: "80%", md: "200px" } }}>
      <Typography sx={{ pl: 2, fontWeight: "bold", mb: 2 }}>Trip</Typography>
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
