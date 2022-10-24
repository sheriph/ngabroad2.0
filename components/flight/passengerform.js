import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
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
import { countries, money, titleCase } from "../../lib/utility";
import DatePicker from "react-datepicker";
import DateOfBirth from "./dateofbirth";
import { flightOffer_, OfferPricing_ } from "../../lib/recoil";
import { useRecoilValue } from "recoil";
import SegmentCards from "./segmentcards";
import { find, first, get, lowerCase, trim, truncate, uniqBy } from "lodash";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import isEmail from "validator/lib/isEmail";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import dayjs from "dayjs";
import ArticleRender from "../others/articlerender";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function PassengerForm() {
  const offerPricing = useRecoilValue(OfferPricing_);
  const mobile = useMediaQuery("(max-width:900px)", { noSsr: true });

  const schema = Yup.object({
    travelersData: Yup.array().of(
      Yup.object().shape({
        nationality: Yup.string()
          .required("Nationality is required")
          .transform((value, originalValue) => originalValue.name),
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
      })
    ),
  }).shape({
    email: Yup.string()
      .required("Email is required")
      .test("check-email", "Email is not valid", (email) =>
        isEmail(`${email}`, {})
      ),
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
      travelersData: get(
        first(get(offerPricing, "data", [])),
        "travelerPricings",
        []
      ),
    },
  });

  const { fields } = useFieldArray({
    control,
    // @ts-ignore
    name: "travelersData",
  });

  const [gender, setGender] = React.useState("Male");
  const flightOffer = useRecoilValue(flightOffer_);

  const [segmentsDrawer, setSegment] = React.useState(false);
  const [rulesDrawer, setRulesDrawer] = React.useState(false);

  const closeDrawer = () => setSegment(false);
  const closeRule = () => setRulesDrawer(false);

  console.log("flightOffer", flightOffer, offerPricing);
  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const onSubmit = async (data) => {
    console.log("data", data);
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
        sx={{ p: 1 }}
      >
        <Typography sx={{ whiteSpace: "nowrap" }}>
          {money(
            get(first(get(offerPricing, "data", [])), "price.grandTotal", 0)
          )}
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
                      // defaultErrorMessage={get(errors, "phone.message", "Phone")}
                      onChange={(phone, countryData) => {
                        console.log({ countryData });
                        onChange(phone);
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
            console.log({ passenger });
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
                    {`${watch(
                      // @ts-ignore
                      `travelersData.${index}.firstname`
                    )} ${watch(
                      // @ts-ignore
                      `travelersData.${index}.lastname`
                    )}`.length >= 2 &&
                      truncate(
                        titleCase(
                          // @ts-ignore
                          `${watch(`travelersData.${index}.firstname`)} ${watch(
                            // @ts-ignore
                            `travelersData.${index}.lastname`
                          )}`
                        ),
                        { length: mobile ? 20 : 50 }
                      )}
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
                            helperText={get(
                              get(errors, "travelersData", [])[index],
                              "firstname.message",
                              ""
                            )}
                            FormHelperTextProps={{ sx: { color: "red" } }}
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
                      name={`travelersData.${index}.title`}
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                          <TextField
                            id="title"
                            select
                            fullWidth
                            size="small"
                            label="Title"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            required
                            helperText={get(
                              get(errors, "travelersData", [])[index],
                              "title.message",
                              ""
                            )}
                            FormHelperTextProps={{ sx: { color: "red" } }}
                          >
                            {["Mr", "Mrs", "Ms"].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        );
                      }}
                    />
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
          updatedOffer={first(get(offerPricing, "data", []))}
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
