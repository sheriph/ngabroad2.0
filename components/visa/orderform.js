import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import useFormPersist from "react-hook-form-persist";
import {
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import CountUp from "react-countup";
import { visaOrderParams_, visaProducts_ } from "../../lib/recoil";
import { money } from "../../lib/utility";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import VisaPassengers from "./visapassengers";
import { useRouter } from "next/router";

export default function VisaOrderForm() {
  const [queryParams, setVisaOrderParams] = useRecoilState(visaOrderParams_);
  const schema = Yup.object().shape({
    /* "Hotel Reservation For Visa": Yup.mixed().transform(
      (value, originalValue) => (originalValue.selected ? originalValue : null)
    ),
    "Flight Reservation For Visa": Yup.mixed().transform(
      (value, originalValue) => (originalValue.selected ? originalValue : null)
    ),
    "Application Form Filling": Yup.mixed().transform((value, originalValue) =>
      originalValue.selected ? originalValue : null
    ),
    "Embassy Appointment Booking": Yup.mixed().transform(
      (value, originalValue) => (originalValue.selected ? originalValue : null)
    ), */
  });

  /*   const {
    "Hotel Reservation For Visa": hotel,
    "Flight Reservation For Visa": flight,
    "Application Form Filling": form,
    "Embassy Appointment Booking": appointment,
    passengers,
    "Departure City, Country": depLocation,
    "Departure City, Country": arrivalLocation,
    "Arrival Date": arrivalDate,
    "Return Date": returndate,
  } = queryParams; */

  console.log('queryParams["Arrival Date"]', queryParams["Arrival Date"]);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    unregister,
    formState: { errors, isSubmitted, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      "Hotel Reservation For Visa": queryParams["Hotel Reservation For Visa"],
      "Flight Reservation For Visa": queryParams["Flight Reservation For Visa"],
      "Application Form Filling": queryParams["Application Form Filling"],
      "Embassy Appointment Booking": queryParams["Embassy Appointment Booking"],
      passengers: queryParams.passengers,
      "Departure City, Country": queryParams["Departure City, Country"],
      "Arrival City, Country": queryParams["Arrival City, Country"],
      // @ts-ignore
      "Arrival Date": queryParams["Arrival Date"],
      // @ts-ignore
      "Return Date": queryParams["Return Date"],
    },
  });
  const router = useRouter();

  /*   useFormPersist("form", {
    watch,
    setValue,
    exclude: ["Arrival Date", "Return Date"],
  }); */

  const [prevValue, setPrevValue] = React.useState(0);

  const values = [
    watch("Application Form Filling"),
    watch("Embassy Appointment Booking"),
    watch("Flight Reservation For Visa"),
    watch("Hotel Reservation For Visa"),
  ]
    .filter((value) => value.selected)
    .reduce((a, b) => a + b.price, 0);

  console.log("hotel", watch("Hotel Reservation For Visa"), values);

  const onSubmit = (data) => {
    console.log("data", data);
    setVisaOrderParams(data);
    router.push("/visa").then(() => router.reload());
  };

  console.log("data errors", errors, queryParams);

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ bgcolor: "background.paper" }}
    >
      <List
        disablePadding
        sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}
      >
        <Controller
          name="Hotel Reservation For Visa"
          // defaultValue={}
          control={control}
          render={({ field }) => {
            const { onChange, value, name, ...rest } = field;
            return (
              <ListItem
                secondaryAction={<Typography>{money(value.price)}</Typography>}
                disablePadding
              >
                <ListItemButton disableRipple disableTouchRipple dense>
                  <ListItemIcon sx={{ minWidth: "unset" }}>
                    <Checkbox
                      checked={value.selected}
                      onChange={(event) =>
                        onChange({ ...value, selected: event.target.checked })
                      }
                      edge="start"
                      //  checked={value.selected}
                      size="medium"
                      //  disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            );
          }}
        />
        <Controller
          name="Flight Reservation For Visa"
          control={control}
          render={({ field }) => {
            const { onChange, value, name, ...rest } = field;
            return (
              <ListItem
                secondaryAction={<Typography>{money(value.price)}</Typography>}
                disablePadding
              >
                <ListItemButton disableRipple disableTouchRipple dense>
                  <ListItemIcon sx={{ minWidth: "unset" }}>
                    <Checkbox
                      checked={value.selected}
                      onChange={(event) =>
                        onChange({ ...value, selected: event.target.checked })
                      }
                      edge="start"
                      //  checked={value.selected}
                      size="medium"
                      //  disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            );
          }}
        />
        <Controller
          name="Application Form Filling"
          control={control}
          render={({ field }) => {
            const { onChange, value, name, ...rest } = field;
            return (
              <ListItem
                secondaryAction={<Typography>{money(value.price)}</Typography>}
                disablePadding
              >
                <ListItemButton disableRipple disableTouchRipple dense>
                  <ListItemIcon sx={{ minWidth: "unset" }}>
                    <Checkbox
                      checked={value.selected}
                      onChange={(event) =>
                        onChange({ ...value, selected: event.target.checked })
                      }
                      edge="start"
                      //  checked={value.selected}
                      size="medium"
                      //  disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            );
          }}
        />
        <Controller
          name="Embassy Appointment Booking"
          control={control}
          render={({ field }) => {
            const { onChange, value, name, ...rest } = field;
            return (
              <ListItem
                secondaryAction={<Typography>{money(value.price)}</Typography>}
                disablePadding
              >
                <ListItemButton disableRipple disableTouchRipple dense>
                  <ListItemIcon sx={{ minWidth: "unset" }}>
                    <Checkbox
                      checked={value.selected}
                      onChange={(event) =>
                        onChange({ ...value, selected: event.target.checked })
                      }
                      edge="start"
                      //  checked={value.selected}
                      size="medium"
                      //  disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            );
          }}
        />
      </List>
      <Grid sx={{ px: 2 }} spacing={2} container>
        <Grid item xs={12} md={6}>
          <Controller
            name="Departure City, Country"
            control={control}
            render={({ field }) => {
              const { onChange, value, name, ...rest } = field;
              return (
                <TextField
                  {...field}
                  id="outlined-basic"
                  label="Departure City, Country"
                  variant="outlined"
                  placeholder="e.g Lagos, Nigeria"
                  size="small"
                  fullWidth
                  required
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="Arrival City, Country"
            control={control}
            render={({ field }) => {
              const { onChange, value, name, ...rest } = field;
              return (
                <TextField
                  {...field}
                  id="outlined-basic"
                  label="Arrival City, Country"
                  variant="outlined"
                  placeholder="e.g London, United Kingdom"
                  fullWidth
                  size="small"
                  required
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="Arrival Date"
            control={control}
            render={({ field }) => {
              const { onChange, value, name, ...rest } = field;
              return (
                <ReactDatePicker
                  selected={value}
                  // @ts-ignore
                  onChange={(date) => onChange(date)}
                  selectsStart
                  startDate={value}
                  endDate={watch("Return Date")}
                  className="mydate"
                  dateFormat="dd MMM, yyyy"
                  placeholderText="Arrival Date"
                  popperClassName="mdatepopper"
                >
                  <Typography textAlign="center">Arrival Date</Typography>
                </ReactDatePicker>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="Return Date"
            control={control}
            render={({ field }) => {
              const { onChange, value, name, ...rest } = field;
              return (
                <ReactDatePicker
                  selected={value}
                  // @ts-ignore
                  onChange={(date) => onChange(date)}
                  selectsEnd
                  startDate={watch("Arrival Date")}
                  endDate={value}
                  minDate={watch("Arrival Date")}
                  className="mydate"
                  dateFormat="dd MMM, yyyy"
                  placeholderText="Return Date"
                  popperClassName="mdatepopper"
                >
                  <Typography textAlign="center">Return Date</Typography>
                </ReactDatePicker>
              );
            }}
          />
        </Grid>
      </Grid>
      <Stack sx={{ py: 2, px: 2 }}>
        <Controller
          name="passengers"
          defaultValue={{
            adult: 1,
            child: 0,
            infant: 0,
          }}
          control={control}
          render={({ field }) => {
            const { onChange, value, name, ...rest } = field;
            return <VisaPassengers value={value} onChange={onChange} />;
          }}
        />
      </Stack>
      <Stack sx={{ p: 2 }} justifyContent="space-between" direction="row">
        <CountUp
          start={prevValue}
          end={values}
          onEnd={() => setPrevValue(values)}
          duration={2.75}
          separator=" "
          // decimals={4}
          decimal=","
          prefix="₦ "
          delay={0}
          redraw={true}
        >
          {({ countUpRef, start, update }) => (
            <Button startIcon={<>Grand Total :</>} variant="outlined">
              <span ref={countUpRef} />
            </Button>
          )}
        </CountUp>
        <Button disabled={!isDirty} type="submit" variant="contained">
          {router.pathname === "/visa" ? "Update" : "Next"}
        </Button>
      </Stack>
    </Stack>
  );
}
