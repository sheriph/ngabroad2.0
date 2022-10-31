import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import PhoneInput from "react-phone-input-2";
import {
  countries,
  money,
  revalidateToken,
  titleCase,
  viewErrors,
} from "../../lib/utility";
import DatePicker from "react-datepicker";
import DateOfBirth from "./dateofbirth";
import {
  blockLoading_,
  flightOffer_,
  OfferPricing_,
  retrieveFlightKey_,
} from "../../lib/recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import SegmentCards from "./segmentcards";
import {
  filter,
  find,
  first,
  forEach,
  get,
  lowerCase,
  trim,
  truncate,
  uniqBy,
} from "lodash";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import isEmail from "validator/lib/isEmail";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import dayjs from "dayjs";
import ArticleRender from "../others/articlerender";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PassportExpiryDate from "./passportexpirydate";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useToast, toast } from "react-toastify";
import { useSWRConfig } from "swr";

export default function PassengerForm() {
  const offerPricing = useRecoilValue(OfferPricing_);
  const offerFromPricing = first(get(offerPricing, "data", []));
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });
  const [dialCode, setDialCode] = React.useState("");
  const setBlockLoading = useSetRecoilState(blockLoading_);
  const setRetrieveFlightKey = useSetRecoilState(retrieveFlightKey_);
  const router = useRouter();
  const { cache } = useSWRConfig();

  console.log("offerPricing", offerPricing);

  const schema = Yup.object({
    travelersData: Yup.array().of(
      Yup.object().shape({
        nationality: Yup.string()
          .required("Nationality is required")
          .transform((value, originalValue) => originalValue.code),
        issuingauthority: Yup.string()
          .required("Nationality is required")
          .transform((value, originalValue) => originalValue.code),
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
            return ["MALE", "FEMALE"].includes(title);
          })
          .transform((value, originalValue) => {
            if (originalValue === "Title") return "Title";
            return originalValue === "Mr" ? "MALE" : "FEMALE";
          }),
        dateofbirth: Yup.string()
          .required("Date of birth is required")
          .when("travelerType", {
            is: "ADULT",
            then: Yup.string().test(
              "check-dob",
              "Invalid date of birth",
              (dob) => {
                const invalidDateOfBirth =
                  dayjs()
                    .subtract(144, "month")
                    .diff(dayjs(dob), "month", true) < 0;
                //  console.log("dob", dob, invalidDateOfBirth);
                return !invalidDateOfBirth;
              }
            ),
          })
          .when("travelerType", {
            is: "CHILD",
            then: Yup.string().test(
              "check-dob",
              "Invalid date of birth",
              (dob) => {
                const invalidDateOfBirth =
                  dayjs()
                    .subtract(24, "month")
                    .diff(dayjs(dob), "month", true) < 0;
                //  console.log("dob", dob, invalidDateOfBirth);
                return !invalidDateOfBirth;
              }
            ),
          })
          .when("travelerType", {
            is: "HELD_INFANT",
            then: Yup.string().test(
              "check-dob",
              "Invalid date of birth",
              (dob) => {
                const invalidDateOfBirth =
                  dayjs().subtract(1, "month").diff(dayjs(dob), "month", true) <
                  0;
                // console.log("dob", dob, invalidDateOfBirth);
                return !invalidDateOfBirth;
              }
            ),
          })
          .transform((value, originalValue) =>
            dayjs(originalValue).format("YYYY-MM-DD")
          ),
        passportexpiry: Yup.string()
          .required("Passport Expiry date is required")
          .test(
            "check-passportexpiry",
            "Invalid Passport expiry date",
            (passportexpiry) => {
              const validpassportexpiry =
                dayjs(passportexpiry).diff(dayjs(), "day", true) > 5;
              //  console.log("dob", dob, invalidDateOfBirth);
              return validpassportexpiry;
            }
          )
          .transform((value, originalValue) =>
            dayjs(originalValue).format("YYYY-MM-DD")
          ),
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

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    unregister,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      phone: "",
      payment: "",
      travelersData: get(offerFromPricing, "travelerPricings", []),
    },
  });

  const { fields } = useFieldArray({
    control,
    // @ts-ignore
    name: "travelersData",
  });

  const flightOffer = useRecoilValue(flightOffer_);

  const [segmentsDrawer, setSegment] = React.useState(false);
  const [rulesDrawer, setRulesDrawer] = React.useState(false);

  const closeDrawer = () => setSegment(false);
  const closeRule = () => setRulesDrawer(false);

  console.log("flightOffer", flightOffer, offerPricing);

  const getModifyOffer = () => {
    const offer = first(get(offerPricing, "data", []));
    const newOffer = {
      // @ts-ignore
      ...offer,
      // @ts-ignore
      itineraries: offer.itineraries.map((itinerary) => ({
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
    console.log("modifyOffer", newOffer, offer);
    return newOffer;
  };

  const sendEmail = async (flightOrder) => {
    try {
      //  await revalidateToken();
      const email = await axios.post("/api/flights/orderemail", {
        flightOffer: getModifyOffer(),
        flightOrder,
        offerPricing2: offerPricing,
      });
      console.log("email", email);
    } catch (error) {
      console.log("email.data error.response", error.response);
    }
  };

  const onSubmit = async (data) => {
    setBlockLoading(true);
    console.log("data", data, dialCode);
    const travelersData = get(data, "travelersData", []);
    const adultPassenger = first(
      filter(travelersData, (traveler) => traveler.travelerType === "ADULT")
    );

    const flightOrderQuery = {
      data: {
        queuingOfficeId: "LOSN824NN",
        ownerOfficeId: "LOSN824NN",
        type: "flight-order",
        flightOffers: [offerFromPricing],
        travelers: travelersData.map((traveler) => ({
          id: traveler.travelerId,
          dateOfBirth: traveler.dateofbirth,
          name: {
            firstName: traveler.firstname,
            lastName: traveler.lastname,
          },
          gender: traveler.title,
          contact: {
            emailAddress: data.email,
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: dialCode,
                number: data.phone.replace(dialCode, ""),
              },
            ],
          },
          documents: [
            {
              documentType: "PASSPORT",
              // birthPlace: "Madrid",
              //  issuanceLocation: "Madrid",
              //  issuanceDate: "2015-04-14",
              number: traveler.passportid,
              expiryDate: traveler.passportexpiry,
              issuanceCountry: traveler.issuingauthority,
              validityCountry: traveler.issuingauthority,
              nationality: traveler.nationality,
              holder: true,
            },
          ],
        })),
        remarks: {
          general: [
            {
              subType: "GENERAL_MISCELLANEOUS",
              text: "ONLINE BOOKING FROM NGABROAD",
            },
          ],
        },
        ticketingAgreement: {
          option: "DELAY_TO_CANCEL",
          delay: "6D",
        },
        contacts: [
          {
            addresseeName: {
              firstName: "ADENIYI",
              lastName: "SHERIFF",
            },
            companyName: "NAIJAGOINGABROAD LTD",
            purpose: "STANDARD",
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: "234",
                number: "9065369929",
              },
            ],
            emailAddress: "info@naijagoingabroad.com",
            address: {
              lines: ["G206 Ogba Multipupose Shopping Mall"],
              postalCode: "23401",
              cityName: "Lagos",
              countryCode: "NG",
            },
          },
          {
            addresseeName: {
              firstName: adultPassenger.firstname,
              lastName: adultPassenger.lastname,
            },
            companyName: "NAIJAGOINGABROAD LTD",
            purpose: "STANDARD",
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: dialCode,
                number: data.phone.replace(dialCode, ""),
              },
            ],
            emailAddress: data.email,
            address: {
              lines: ["G206 Ogba Multipupose Shopping Mall"],
              postalCode: "23401",
              cityName: "Lagos",
              countryCode: "NG",
            },
          },
        ],
      },
    };

    console.log("flightOrderQuery", flightOrderQuery);

    try {
      await revalidateToken();
      const flightOrder = await axios.post("/api/flights/createorder", {
        data: JSON.stringify(flightOrderQuery),
        offerPricing,
        payment: data.payment,
      });

      const reference = get(
        find(get(flightOrder.data, "flightOrder.data.associatedRecords", []), {
          originSystemCode: "GDS",
        }),
        "reference",
        ""
      );
      const lastname = get(
        first(get(flightOrder.data, "flightOrder.data.travelers", [])),
        "name.lastName",
        ""
      );

      console.log("flightOrder.data", flightOrder.data);
      // @ts-ignore
      setRetrieveFlightKey({ reference, lastname });
      //  setCookie("findbooking", JSON.stringify({ reference, lastname }), {});
      await sendEmail(flightOrder.data).finally(() =>
        router.push("/flights/confirm-booking")
      );
    } catch (error) {
      console.log("flightOrder.data", error.response, flightOrderQuery);
      viewErrors(get(error.response, "data.errors", []));
    } finally {
      setBlockLoading(false);
    }
  };

  console.log("form", watch("phone"), errors);
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      sx={{ p: 1 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ p: 1 }}
      >
        <Typography sx={{ whiteSpace: "nowrap" }}>
          {money(get(offerFromPricing, "price.grandTotal", 0))}
        </Typography>
        <Link
          onClick={() => setRulesDrawer(true)}
          sx={{ whiteSpace: "nowrap", cursor: "pointer" }}
          underline="always"
        >
          Ticket Rules
        </Link>
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
                      onChange={(phone, countryData) => {
                        // @ts-ignore
                        setDialCode(countryData.dialCode);
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
            console.log(
              { passenger },
              `${watch(
                // @ts-ignore
                `travelersData.${index}.firstname`
              )} ${watch(
                // @ts-ignore
                `travelersData.${index}.lastname`
              )}`
            );
            return (
              <Paper key={passenger.id} sx={{ p: 2 }} variant="outlined">
                <Stack
                  direction="row"
                  sx={{ mb: 2 }}
                  justifyContent="space-between"
                >
                  <Typography>
                    {
                      // @ts-ignore
                      passenger.travelerId
                    }
                    :{" "}
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
                  <Grid item xs={6} md={3}>
                    <Controller
                      // @ts-ignore
                      name={`travelersData.${index}.nationality`}
                      // @ts-ignore
                      defaultValue={find(
                        countries,
                        (country) => country.name === "Nigeria"
                      )}
                      // rules={{ required: true }}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <Autocomplete
                            // @ts-ignore
                            value={value}
                            disablePortal
                            id="nationality"
                            options={countries}
                            onChange={(event, newValue) => {
                              onChange(newValue);
                            }}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                label="Nationality"
                                helperText={get(
                                  get(errors, "travelersData", [])[index],
                                  "nationality.message",
                                  ""
                                )}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                              />
                            )}
                          />
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Controller
                      // @ts-ignore
                      name={`travelersData.${index}.dateofbirth`}
                      // @ts-ignore
                      defaultValue={new Date()}
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <DateOfBirth
                            value={value}
                            onChange={onChange}
                            minAge={
                              // @ts-ignore
                              passenger.travelerType === "ADULT"
                                ? 1200
                                : // @ts-ignore
                                passenger.travelerType === "CHILD"
                                ? 143
                                : 23
                            }
                            maxAge={
                              // @ts-ignore
                              passenger.travelerType === "ADULT"
                                ? 144
                                : // @ts-ignore
                                passenger.travelerType === "CHILD"
                                ? 24
                                : 1
                            }
                          />
                        );
                      }}
                    />
                    {get(
                      get(errors, "travelersData", [])[index],
                      "dateofbirth.message",
                      ""
                    ) && (
                      <Typography
                        sx={{ pl: 1, pt: 1 }}
                        color="red"
                        variant="caption"
                      >
                        {get(
                          get(errors, "travelersData", [])[index],
                          "dateofbirth.message",
                          ""
                        )}
                      </Typography>
                    )}
                  </Grid>
                  <Grid sx={{ py: 1 }} xs={12}>
                    <Divider sx={{ mr: -2 }}>
                      <Chip
                        color="primary"
                        size="small"
                        label="Passport Information"
                      />
                    </Divider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Controller
                      // @ts-ignore
                      name={`travelersData.${index}.passportid`}
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <TextField
                            {...field}
                            required
                            id="passportid"
                            label="Passport Number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            helperText={get(
                              get(errors, "travelersData", [])[index],
                              "passportid.message",
                              ""
                            )}
                            FormHelperTextProps={{ sx: { color: "red" } }}
                          />
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Controller
                      // @ts-ignore
                      name={`travelersData.${index}.issuingauthority`}
                      // @ts-ignore
                      defaultValue={find(
                        countries,
                        (country) => country.name === "Nigeria"
                      )}
                      // rules={{ required: true }}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <Autocomplete
                            // @ts-ignore
                            value={value}
                            disablePortal
                            id="issuingauthority"
                            options={countries}
                            onChange={(event, newValue) => {
                              onChange(newValue);
                            }}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                label="Issuing Authority"
                                helperText={get(
                                  get(errors, "travelersData", [])[index],
                                  "issuingauthority.message",
                                  ""
                                )}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                              />
                            )}
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Controller
                      // @ts-ignore
                      name={`travelersData.${index}.passportexpiry`}
                      // @ts-ignore
                      defaultValue={new Date()}
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <PassportExpiryDate
                            value={value}
                            onChange={onChange}
                          />
                        );
                      }}
                    />
                    {get(
                      get(errors, "travelersData", [])[index],
                      "passportexpiry.message",
                      ""
                    ) && (
                      <Typography
                        sx={{ pl: 1, pt: 1 }}
                        color="red"
                        variant="caption"
                      >
                        {get(
                          get(errors, "travelersData", [])[index],
                          "passportexpiry.message",
                          ""
                        )}
                      </Typography>
                    )}
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
                  {[
                    "Online Debit/Credit Card",
                    "Bank Transfer",
                    "Book on Hold",
                  ].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />

          <Button type="submit" variant="outlined">
            Complete Booking
          </Button>
        </Stack>
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
        <SegmentCards
          updatedOffer={offerFromPricing}
          closeDrawer={closeDrawer}
        />
      </Drawer>
      <Drawer
        sx={{
          // width: { sm: "100%", md: "700px" },
          zIndex: (t) => t.zIndex.appBar + 105,
          "& .MuiDrawer-paper": { width: { xs: "100%", md: 450 } },
        }}
        anchor="left"
        open={rulesDrawer}
        onClose={closeRule}
      >
        <Stack>
          <Paper
            justifyContent="space-between"
            component={Stack}
            variant="outlined"
            direction="row"
            sx={{ p: 1 }}
          >
            <Typography>TICKET RULES</Typography>
            <CloseOutlinedIcon onClick={closeRule} sx={{ cursor: "pointer" }} />
          </Paper>

          <Stack
            divider={<Divider orientation="horizontal" flexItem />}
            sx={{ p: 1 }}
            spacing={2}
          >
            {uniqBy(
              Array.from(
                Object.values(
                  get(offerPricing, `included["detailed-fare-rules"]`, {})
                )
              ),
              "fareBasis"
            ).map((rule, index) => (
              <Stack>
                <Typography sx={{ py: 2 }} variant="h1" textAlign="center">
                  {titleCase(rule.name)} - {rule.fareBasis}{" "}
                </Typography>
                <ArticleRender
                  content={titleCase(
                    get(
                      find(
                        get(rule, "fareNotes.descriptions", []),
                        (description) =>
                          description.descriptionType === "PENALTIES"
                      ),
                      "text",
                      ""
                    )
                  )}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
}
