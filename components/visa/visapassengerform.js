import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import PhoneInput from "react-phone-input-2";
import { money, titleCase } from "../../lib/utility";
import { get, trim, truncate } from "lodash";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import isEmail from "validator/lib/isEmail";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import dayjs from "dayjs";
import VisaOrderForm from "./orderform";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { blockLoading_, passengers_, visaOrderParams_ } from "../../lib/recoil";
import { uniqueId } from "lodash";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function VisaPassengerForm() {
  const visaOrderParams = useRecoilValue(visaOrderParams_);
  const setBlockLoading = useSetRecoilState(blockLoading_);
  const router = useRouter();

  const schema = Yup.object({
    travelersData: Yup.array().of(
      Yup.object().shape({
        firstname: Yup.string()
          .required("First Name is required")
          .transform((value, originalValue) =>
            trim(originalValue.toLowerCase())
          ),
        lastname: Yup.string()
          .required("Last Name is required")
          .transform((value, originalValue) =>
            trim(originalValue.toLowerCase())
          ),
        title: Yup.string()
          .required("Title is required")
          .test("check-title", "Title is required", (title) => {
            console.log("title", title);
            // @ts-ignore
            return ["Mr", "Mrs", "Ms"].includes(title);
          }),
      })
    ),
  }).shape({
    email: Yup.string()
      .required("Email is required")
      .test("check-email", "Email is not valid", (email) =>
        isEmail(`${email}`, {})
      )
      .transform((value, originalValue) => trim(originalValue.toLowerCase())),
    phone: Yup.string()
      .required("Phone is required")
      .test("check-phone", "Phone number is not valid", (phone) => {
        // console.log("phone", phone);
        return isPossiblePhoneNumber(`+${phone}`, {});
      }),
  });

  // @ts-ignore
  const { passengers } = visaOrderParams;

  const getTravelersData = () => {
    const adultData = Array.from(
      { length: passengers ? passengers.adult : 0 },
      (_, i) => ({
        travelerType: "ADULT",
        travelerId: uniqueId(),
      })
    );
    const childData = Array.from(
      { length: passengers ? passengers.child : 0 },
      (_, i) => ({
        travelerType: "CHILD",
        travelerId: uniqueId(),
      })
    );
    const infantData = Array.from(
      { length: passengers ? passengers.infant : 0 },
      (_, i) => ({
        travelerType: "INFANT",
        travelerId: uniqueId(),
      })
    );

    // @ts-ignore
    return [...adultData, ...childData, ...infantData];
  };

  const mobile = useMediaQuery("(max-width:600px)", { noSsr: true });

  console.log("visaOrderParams", visaOrderParams);
  const {
    handleSubmit,
    control,
    watch,
    unregister,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      phone: "",
      payment: "",
      travelersData: getTravelersData(),
    },
  });

  const { fields } = useFieldArray({
    control,
    // @ts-ignore
    name: "travelersData",
  });

  const onSubmit = async (data) => {
    console.log("data 2", data);
    const reference = Math.random().toString(36).slice(2, 10).toUpperCase();
    setBlockLoading(true);
    try {
      await toast.promise(
        axios.post("/api/visa/createvisaorder", {
          reference,
          visaOrderParams,
          passengerData: data,
        }),
        {
          error: "Failed to create order",
          pending: "Creating your order",
          success: "Successfuly created your order",
        }
      );
      await toast.promise(
        axios.post("/api/visa/orderemail", {
          passengerData: data,
          visaOrderParams,
          reference,
          createdAt: new Date(),
          paymentLink: `${window.location.hostname}/visa/myorder/?ref=${reference}`,
        }),
        {
          error: "Fail to send booking to email",
          pending: "Sending your booking to mail",
          success: "Your order has been sent to email",
        }
      );
      setCookie("reference", reference, { maxAge: 60 * 60 });
      console.log("reference", reference);
      router.push(`/visa/myorder/?ref=${reference}`);
    } catch (error) {
      console.log("error", error);
    } finally {
      setBlockLoading(false);
    }
  };

  console.log("data 2", errors);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      //justifyContent="space-between"
      sx={{ p: 1 }}
      spacing={{ xs: 1, md: 1 }}
    >
      <Stack
        sx={{
          //   p: 1,
          height: "max-content",
          width: { xs: "100%", md: "600px" },
        }}
      >
        <Accordion disableGutters defaultExpanded={!mobile} variant="outlined">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Edit Order</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <VisaOrderForm />
          </AccordionDetails>
        </Accordion>
      </Stack>
      <Stack
        sx={{
          //   p: 1,
          height: "max-content",
          width: { xs: "100%", md: "600px" },
        }}
      >
        <Accordion disableGutters defaultExpanded={!mobile} variant="outlined">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Order Summary</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List
              disablePadding
              sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}
            >
              {Object.entries(visaOrderParams).map((product, index) => {
                const [productName, value] = product;
                // @ts-ignore
                if (value?.selected) {
                  return (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Typography>
                          {money(
                            // @ts-ignore
                            value.price
                          )}
                        </Typography>
                      }
                      disablePadding
                    >
                      <ListItemButton disableRipple disableTouchRipple dense>
                        <ListItemIcon sx={{ minWidth: "unset" }}>
                          <Checkbox
                            disabled
                            defaultChecked
                            edge="start"
                            size="medium"
                          />
                        </ListItemIcon>
                        <ListItemText primary={productName} />
                      </ListItemButton>
                    </ListItem>
                  );
                }
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </Stack>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
        <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
          <Typography sx={{ mb: 2 }}>Contact Details</Typography>
          <Grid spacing={2} container>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                defaultValue=""
                control={control}
                render={({ field }) => {
                  const { onChange, value, ...rest } = field;
                  return (
                    <TextField
                      {...field}
                      sx={{
                        "& .MuiOutlinedInput-input": { height: "1.4875em" },
                      }}
                      id="email"
                      label="Email"
                      variant="outlined"
                      size="small"
                      fullWidth
                      required
                      helperText={get(errors, "email.message", "")}
                      FormHelperTextProps={{ sx: { color: "red" } }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                defaultValue=""
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value, ...rest } = field;
                  return (
                    <PhoneInput
                      country={"ng"}
                      value={value}
                      // @ts-ignore
                      onChange={(phone) => {
                        // @ts-ignore
                        onChange(phone);
                        // @ts-ignore
                      }}
                      inputProps={{
                        name: "phone",
                        required: true,
                      }}
                    />
                  );
                }}
              />
              <Typography sx={{ pl: 2, pt: 1 }} color="red" variant="caption">
                {get(errors, "phone.message", "")}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Stack spacing={2}>
          {fields.map((passenger, index) => {
            return (
              <Paper key={passenger.id} sx={{ p: 2 }} variant="outlined">
                <Stack
                  direction="row"
                  sx={{ mb: 2 }}
                  justifyContent="space-between"
                >
                  <Typography>
                    {index + 1}:{" "}
                    {!`${watch(
                      // @ts-ignore
                      `travelersData.${index}.firstname`
                    )} ${watch(
                      // @ts-ignore
                      `travelersData.${index}.lastname`
                    )}`.includes("undefined")
                      ? truncate(
                          titleCase(
                            `${watch(
                              // @ts-ignore
                              `travelersData.${index}.firstname`
                            )} ${watch(
                              // @ts-ignore
                              `travelersData.${index}.lastname`
                            )}`
                          ),
                          { length: mobile ? 20 : 50 }
                        )
                      : ""}
                  </Typography>
                  <Typography>
                    {
                      // @ts-ignore
                      passenger.travelerType === "ADULT"
                        ? "Adult (over 12 years)"
                        : // @ts-ignore
                        passenger.travelerType === "CHILD"
                        ? "Child (2-12 years)"
                        : "Infant (below 2 years)"
                    }
                  </Typography>
                </Stack>
                <Grid spacing={2} container>
                  <Grid item xs={12} md={6}>
                    <Controller
                      // @ts-ignore
                      name={`travelersData.${index}.firstname`}
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <TextField
                            {...field}
                            id="firstname"
                            label="First Name"
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            helperText={
                              <React.Fragment>
                                {get(
                                  get(errors, "travelersData", [])[index],
                                  "firstname.message",
                                  ""
                                )}{" "}
                                {get(
                                  get(errors, "travelersData", [])[index],
                                  "title.message",
                                  ""
                                )}
                              </React.Fragment>
                            }
                            FormHelperTextProps={{ sx: { color: "red" } }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  sx={{
                                    mt: 0.5,
                                    "& .MuiSelect-icon": {
                                      top: "calc(50% - .6em)",
                                    },
                                  }}
                                  position="start"
                                >
                                  <Controller
                                    // @ts-ignore
                                    name={`travelersData.${index}.title`}
                                    defaultValue="Title"
                                    rules={{ required: true }}
                                    control={control}
                                    render={({ field }) => {
                                      const { onChange, value, ...rest } =
                                        field;
                                      return (
                                        <TextField
                                          id="title"
                                          select
                                          fullWidth
                                          size="small"
                                          //  label="Title"
                                          value={value}
                                          onChange={(e) =>
                                            onChange(e.target.value)
                                          }
                                          variant="standard"
                                          InputProps={{
                                            disableUnderline: true,
                                          }}
                                          required
                                        >
                                          {["Title", "Mr", "Mrs", "Ms"].map(
                                            (option) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                {option}
                                              </MenuItem>
                                            )
                                          )}
                                        </TextField>
                                      );
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      // @ts-ignore
                      name={`travelersData.${index}.lastname`}
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <TextField
                            {...field}
                            id="lastname"
                            label="Last Name"
                            variant="outlined"
                            size="small"
                            required
                            fullWidth
                            helperText={get(
                              get(errors, "travelersData", [])[index],
                              "lastname.message",
                              ""
                            )}
                            FormHelperTextProps={{ sx: { color: "red" } }}
                          />
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Stack>
        <Stack sx={{ mt: 2 }} justifyContent="space-between" direction="row">
          <Controller
            name="payment"
            defaultValue=""
            rules={{ required: true }}
            control={control}
            render={({ field }) => {
              const { onChange, value, ...rest } = field;
              return (
                <TextField
                  id="payment"
                  select
                  size="small"
                  label="Payment Option"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  sx={{ width: { xs: 150, md: 200 } }}
                  required
                  helperText={get(errors, "payment.message", "")}
                  FormHelperTextProps={{ sx: { color: "red" } }}
                >
                  {["Online Debit/Credit Card", "Bank Transfer"].map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </TextField>
              );
            }}
          />

          <Button type="submit" variant="outlined">
            Complete Booking
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
