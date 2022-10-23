import {
  Autocomplete,
  Box,
  Drawer,
  Grid,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import PhoneInput from "react-phone-input-2";
import { countries } from "../../lib/utility";
import DatePicker from "react-datepicker";
import DateOfBirth from "./dateofbirth";
import { flightOffer_, OfferPricing_ } from "../../lib/recoil";
import { useRecoilValue } from "recoil";
import SegmentCards from "./segmentcards";

export default function PassengerForm() {
  const [val, setVal] = React.useState("");
  const [gender, setGender] = React.useState("Male");
  const flightOffer = useRecoilValue(flightOffer_);
  const OfferPricing = useRecoilValue(OfferPricing_);

  const [segmentsDrawer, setSegment] = React.useState(false);
  const closeDrawer = () => setSegment(false);

  console.log("flightOffer", flightOffer, OfferPricing);
  const handleChange = (event) => {
    setGender(event.target.value);
  };

  console.log("val", val);
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      sx={{ p: 1 }}
    >
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        sx={{ p: 1 }}
      >
        <Typography sx={{ whiteSpace: "nowrap" }}>NGN 537,500</Typography>
        <Link
          onClick={() => setSegment(true)}
          sx={{ whiteSpace: "nowrap", cursor: "pointer" }}
          underline="always"
        >
          Flight Info
        </Link>
      </Stack>
      <Box width="100%">
        <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
          <Typography sx={{ mb: 2 }}>Contact Details</Typography>
          <Grid spacing={2} container>
            <Grid item xs={12} md={6}>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-input": { height: "1.4875em" },
                }}
                id="email"
                label="Email"
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PhoneInput
                country={"ng"}
                value={val}
                onChange={(phone) => setVal(phone)}
                inputProps={{
                  name: "phone",
                  required: true,
                }}
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper sx={{ p: 2 }} variant="outlined">
          <Stack direction="row" sx={{ mb: 2 }} justifyContent="space-between">
            <Typography>Passegenger 1</Typography>
            <Typography>Adult (over 12 years)</Typography>
          </Stack>
          <Grid spacing={2} container>
            <Grid item xs={12} md={6}>
              <TextField
                id="firstname"
                label="First Name"
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="lastname"
                label="Last Name"
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Autocomplete
                disablePortal
                id="nationality"
                options={countries}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    label="Nationality"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                id="gender"
                select
                fullWidth
                size="small"
                label="Gender"
                value={gender}
                onChange={handleChange}
              >
                {["Male", "Female"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                id="passportid"
                label="Passport Number"
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <DateOfBirth />
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Drawer
        sx={{
          // width: { sm: "100%", md: "700px" },
          zIndex: (t) => t.zIndex.appBar + 105,
          "& .MuiDrawer-paper": { width: { xs: "100%", md: 450 } },
        }}
        anchor="right"
        open={flightOffer ? segmentsDrawer : false}
        onClose={closeDrawer}
      >
        <SegmentCards closeDrawer={closeDrawer} />
      </Drawer>
    </Stack>
  );
}
