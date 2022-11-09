import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { find, first, get, isEqual, trim } from "lodash";
import { getCookie } from "cookies-next";
import useSWRImmutable from "swr/immutable";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { blockLoading_, retrieveFlightKey_ } from "../../lib/recoil";
import { toast } from "react-toastify";
import Script from "next/script";

import {
  makePayment,
  money,
  revalidateToken,
  titleCase,
} from "../../lib/utility";
import { useSWRConfig } from "swr";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const getOrder = async (reference) => {
  try {
    const order = toast.promise(
      axios.post("/api/visa/getorder", { reference }),
      {
        error: "Failed to retrieve order, please check your reference",
        pending: "Loading your order",
        success: "Success",
      }
    );
    return (await order).data;
  } catch (error) {
    console.log("error.response", error.response);
  }
};

export default function FindMyOrder() {
  const schema = Yup.object().shape({
    reference: Yup.string()
      .required("Booking reference is required")
      .transform((value, originalValue) => trim(originalValue.toUpperCase())),
  });
  const setBlockLoading = useSetRecoilState(blockLoading_);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  const router = useRouter();

  const ref = get(router, "query.ref", undefined);

  React.useEffect(() => {
    if (window !== undefined) {
      console.log(
        "router",
        `${window.location.hostname}/visa/myorder/?ref=${ref}`
      );
    }
  }, [null]);

  //const [reference, setReference] = React.useState("");

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { reference: "" },
  });
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  const {
    data: order,
    error,
    mutate,
    isLoading,
    isValidating,
    // @ts-ignore
  } = useSWRImmutable(ref, getOrder, {
    keepPreviousData: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    revalidateOnMount: true,
  });

  // @ts-ignore
  const {
    reference: bookingReference,
    visaOrderParams,
    passengerData,
    createdAt,
    paymentStatus,
  } = order || {};

  const amount = [
    get(visaOrderParams, "Application Form Filling", {}),
    get(visaOrderParams, "Embassy Appointment Booking", {}),
    get(visaOrderParams, "Flight Reservation For Visa", {}),
    get(visaOrderParams, "Hotel Reservation For Visa", {}),
  ]
    .filter((value) => value.selected)
    .reduce((a, b) => a + b.price, 0);

  console.log("amount", amount, router);

  const onSubmit = async (data) => {
    console.log("data", data);
    const { reference } = data;
    //setReference(reference);
    router.push(`/visa/myorder/?ref=${reference}`);
  };

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  console.log("passengerData", passengerData, visaOrderParams);
  const handlePayment = () => {
    const { firstname, lastname } = first(
      get(passengerData, "travelersData", {})
    );
    makePayment(
      amount,
      get(passengerData, "email", ""),
      get(passengerData, "phone", ""),
      `${firstname} ${lastname}`,
      bookingReference,
      passengerData,
      visaOrderParams,
      mutate,
      setBlockLoading
    );
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      sx={{ p: 1 }}
      spacing={2}
    >
      <Stack spacing={1}>
        <Script
          src="https://checkout.flutterwave.com/v3.js"
          strategy="lazyOnload"
          onLoad={() => {
            console.log("Payment Script has loaded");
            setScriptLoaded(true);
          }}
        />
        <Accordion defaultExpanded={!mobile} variant="outlined">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Find My Order</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={1}
              sx={{ width: { xs: "100%", md: 250 } }}
            >
              <Controller
                name="reference"
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
                      id="reference"
                      label="Booking Reference"
                      variant="outlined"
                      size="small"
                      fullWidth
                      required
                      helperText={get(errors, "reference.message", "")}
                      FormHelperTextProps={{ sx: { color: "red" } }}
                    />
                  );
                }}
              />
              <Button
                fullWidth
                disableElevation
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={!mobile} variant="outlined">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Payment Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Typography>
                NAIJAGOINGABROAD LTD <br />
                STANBIC IBTC BANK : 00278282828 <br />
                WEMA BANK NIGERIA : 002728282828
              </Typography>
              {paymentStatus === "paid" ? (
                <Alert severity="success">Payment Already completed</Alert>
              ) : (
                <Button
                  size="small"
                  onClick={handlePayment}
                  disabled={!scriptLoaded && !Boolean(amount)}
                >
                  Click To Pay online
                </Button>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
      <Box sx={{ mt: 2 }} width="100%">
        {!order ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "500px" }}
          >
            <Typography variant="h1">NO ORDER FOUND</Typography>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Stack sx={{ bgcolor: "background.paper", p: 2 }} spacing={1}>
              <Divider sx={{ mx: -2, mb: 2 }}>
                <Chip size="small" label="Order Information" color="primary" />
              </Divider>
              {get(passengerData, "travelersData", []).map(
                (traveler, index) => {
                  const { firstname, lastname, title, travelerType } = traveler;
                  return (
                    <Typography key={index}>
                      {`${title} ${titleCase(firstname)}`}{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {titleCase(lastname)}
                      </span>{" "}
                      ({titleCase(travelerType)})
                    </Typography>
                  );
                }
              )}
              <Typography>
                {get(passengerData, "email", "")} ||{" "}
                {get(passengerData, "phone", "")}
              </Typography>
              <Typography>
                Reference: {bookingReference} || Booked on:{" "}
                {dayjs(createdAt).format("DD MMM YYYY")}
              </Typography>
            </Stack>
            <Stack sx={{ bgcolor: "background.paper" }} spacing={2}>
              <Divider sx={{ mt: 3 }}>
                <Chip size="small" label="Order Information" color="primary" />
              </Divider>
              <List disablePadding>
                {Object.entries(visaOrderParams || {}).map((product, index) => {
                  const [productName, value] = product;
                  // @ts-ignore
                  if (typeof value === "string") {
                    return (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <Typography>
                            {dayjs(value).isValid()
                              ? dayjs(value).format("DD MMM YYYY")
                              : value}
                          </Typography>
                        }
                        disablePadding
                      >
                        <ListItemButton disableRipple disableTouchRipple dense>
                          <ListItemIcon sx={{ minWidth: "unset", mr: 1 }}>
                            <StarBorderIcon />
                          </ListItemIcon>
                          <ListItemText primary={productName} />
                        </ListItemButton>
                      </ListItem>
                    );
                  }
                })}
                <Divider sx={{ pb: 2 }}>
                  <Chip size="small" label="Services Ordered" color="primary" />
                </Divider>
                {Object.entries(visaOrderParams || {}).map((product, index) => {
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
                              color="primary"
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
            </Stack>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
