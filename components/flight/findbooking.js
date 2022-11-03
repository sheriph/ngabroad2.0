import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Link,
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
import SegmentCards from "./segmentcards";
import { useRecoilState, useSetRecoilState } from "recoil";
import { blockLoading_, retrieveFlightKey_ } from "../../lib/recoil";
import { toast } from "react-toastify";
import { revalidateToken, titleCase } from "../../lib/utility";
import { useSWRConfig } from "swr";

const getOrder = async (key) => {
  try {
    const objectKey = JSON.parse(key);
    const order = await axios.post("/api/flights/order", { ...objectKey });
    console.log("retrival in fetch", order.data);
    if (!order.data)
      toast.error(
        `No record found for ${titleCase(objectKey.lastname)} with Reference ${
          objectKey.reference
        }`
      );
    return order.data;
  } catch (error) {
    console.log("error.response", error.response);
  }
};


export default function FindBooking() {
  const schema = Yup.object().shape({
    lastname: Yup.string()
      .required("Surname is required")
      .transform((value, originalValue) => trim(originalValue.toLowerCase())),
    reference: Yup.string()
      .required("Booking reference is required")
      .transform((value, originalValue) => trim(originalValue.toUpperCase())),
  });
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { lastname: "", reference: "" },
  });
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });
  const [retrieveFlightKey, setRetrieveFlightKey] =
    useRecoilState(retrieveFlightKey_);
  const setBlockLoading = useSetRecoilState(blockLoading_);
  const { cache } = useSWRConfig();

  // const key = getCookie("findbooking");

  const {
    data: order,
    error,
    mutate,
    isLoading,
    isValidating,
    // @ts-ignore
  } = useSWRImmutable(
    retrieveFlightKey ? JSON.stringify(retrieveFlightKey) : undefined,
    getOrder,
    {
      keepPreviousData: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  const { flightOrder, offerPricing, payment } = order || {};
  const offerFromPricing = first(get(offerPricing, "data", []));

  console.log("retrival", {
    order,
    error,
    isLoading,
    isValidating,
  });

  console.log("errors", errors);

  const getModifyOffer = () => {
    //  const offer = first(get(offerPricing, "data", []));
    const newOffer = {
      // @ts-ignore
      ...offerFromPricing,
      // @ts-ignore
      itineraries: offerFromPricing.itineraries.map((itinerary) => ({
        ...itinerary,
        segments: itinerary.segments.map((segment) => ({
          ...segment,
          carrierCode: get(cache.get(segment.carrierCode), "data", ""),
          departure: {
            ...segment.departure,
            iataCode: get(cache.get(segment.departure.iataCode), "data", {}),
          },
          arrival: {
            ...segment.departure,
            iataCode: get(cache.get(segment.arrival.iataCode), "data", {}),
          },
        })),
      })),
    };

    // @ts-ignore
    // setFlightOffer(newOffer);
    console.log("modifyOffer", newOffer);
    return newOffer;
  };

  const sendEmail = async () => {
    try {
      //  await revalidateToken();
      const email = await axios.post("/api/flights/orderemail", {
        flightOffer: getModifyOffer(),
        flightOrder,
        offerPricing2: offerPricing,
      });
      toast.success("Done. Please check your email");
      console.log("email", email);
    } catch (error) {
      console.log("email.data error.response", error);
    }
  };

  const onSubmit = async (data) => {
    console.log("data", data);
    const { reference, lastname } = data;

    if (isEqual(data, retrieveFlightKey)) {
      toast.error(
        `No record found for ${titleCase(data.lastname)} with Reference ${
          data.reference
        }`
      );
      return;
    }
    // @ts-ignore
    setRetrieveFlightKey({ reference, lastname });
  };

  React.useEffect(() => {
    if (isLoading || isValidating) {
      setBlockLoading(true);
    } else {
      setBlockLoading(false);
    }
  }, [isLoading, isValidating]);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      sx={{ p: 1 }}
      spacing={2}
    >
      <Stack spacing={1}>
        <Accordion defaultExpanded={!mobile} variant="outlined">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Find My Booking</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={1}
              sx={{ width: { xs: "100%", md: 300 } }}
            >
              <Controller
                name="lastname"
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
                      id="lastname"
                      label="Last Name"
                      variant="outlined"
                      size="small"
                      fullWidth
                      required
                      helperText={get(errors, "lastname.message", "")}
                      FormHelperTextProps={{ sx: { color: "red" } }}
                    />
                  );
                }}
              />
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
              <Link sx={{ cursor: "pointer" }} underline="always">
                Click Here To Pay online
              </Link>
              <Link
                onClick={() => sendEmail()}
                sx={{ cursor: "pointer" }}
                underline="always"
              >
                Email This Booking
              </Link>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
      <Box sx={{ mt: 2 }} width="100%">
        {order ? (
          <SegmentCards
            flightOrder={flightOrder}
            updatedOffer={offerFromPricing}
            closeDrawer={null}
            offerPricing2={offerPricing}
          />
        ) : (
          <Stack justifyContent="center" alignItems="center">
            <Typography>DISPLAY BOOKING RESULT HERE</Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
