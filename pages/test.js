import { Box, Button, Divider, Stack } from "@mui/material";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { first, get } from "lodash";
import React from "react";
import { revalidateToken } from "../lib/utility";
import useSWRImmutable from "swr/immutable";
import { useSWRConfig } from "swr";
import Amplify, { API, Auth } from "aws-amplify";

const getLocationName = async (iataCode) => {
  try {
    const name = await axios.post("/api/flights/locationname", {
      iataCode,
    });

    return get(name, "data.data", null);
  } catch (error) {
    console.log("error", error.response);
    throw new Error(error.response);
  }
};

export default function Test() {
  const { data, mutate, isLoading, isValidating } = useSWRImmutable(
    undefined,
    getLocationName,
    {
      keepPreviousData: true,
      shouldRetryOnError: true,
      errorRetryCount: 1,
    }
  );

  const { cache } = useSWRConfig();

  const [myHtml, setHtml] = React.useState("");
  const [flightOffer, setFlightOffer] = React.useState(null);
  const processWp = async () => {
    try {
      // const posts = await axios.get("/api/processwp");
      // console.log("posts", posts.data);
    } catch (error) {
      console.log(error.response.data, error);
    }
  };

  const getModifyOffer = () => {
    const newOffer = {
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
    setFlightOffer(newOffer);
    console.log("modifyOffer", newOffer, offer);
  };

  React.useEffect(() => {}, [isLoading, isValidating]);

  const checkCookie = async () => {
    try {
      /* const response = await axios.get("/api/flights/accesstoken");
      console.log("response", response.data);
      setCookie("accessToken", response.data.access_token, {
        maxAge: response.data.expires_in,
      });
      console.log("token", getCookie("accessToken")); */
      await revalidateToken();
      await axios.get("/api/flights/checkcookie");
    } catch (error) {
      console.log("error.response.data", error.response.data);
    }
  };

  const testemail = async () => {
    try {
      //  await revalidateToken();
      const email = await axios.post("/api/flights/orderemail", {
        flightOffer: flightOffer,
        flightOrder,
        offerPricing2: offerPricing,
      });
      console.log(
        "email.data",
        { data: email.data },
        flightOffer,
        offer,
        flightOrder
      );
      setHtml(email.data);
    } catch (error) {
      console.log(
        "email.data error.response",
        error.response,
        flightOffer,
        offer
      );
    }
  };

  const testVisa = async () => {
    try {
      //  await revalidateToken();
      const email = await axios.post("/api/visa/orderemail", {
        passengerData,
        visaOrderParams,
        reference: "OIDIJDJODJ",
        createdAt: new Date(),
      });
      console.log("email.data", { data: email.data });
      setHtml(email.data);
    } catch (error) {
      console.log("email.data error.response", error.response);
    }
  };

  const runLambda = async () => {
    try {
      const data = await API.post("apiforhello", "/datasource", {
        name: "babatunde",
      });
      console.log("data lambda", data);
    } catch (error) {
      console.log("data lambda error", error.response);
    }
  };

  return (
    <Stack
      divider={<Divider sx={{ mb: 2 }} orientation="horizontal" flexItem />}
    >
      {/* <Button onClick={processWp}>PROCESS WP</Button> */}
      <Button onClick={testVisa}>RUN</Button>
      {/* <Button onClick={runLambda}>TEST LAMBDA</Button> */}
      <Box dangerouslySetInnerHTML={{ __html: myHtml }} />
    </Stack>
  );
}

const flightOrder = {
  warnings: [
    {
      status: 200,
      code: 0,
      title: "ErrorDuringQueueingAfterBookingWarning",
      detail: "The Queuing Office ID hasn't been defined",
    },
    {
      status: 200,
      code: 0,
      title: "NameTruncationWarning",
      detail:
        "Name has been truncated for some passengers in the booking record",
    },
    {
      status: 200,
      code: 0,
      title: "ErrorDuringOwnershipChangeWarning",
      detail: "Error during the ownership change",
      source: {
        pointer: "/data/ownerOfficeId",
      },
    },
  ],
  data: {
    type: "flight-order",
    id: "eJzTd9f3jop0NvUCAAuWAmY%3D",
    queuingOfficeId: "LOSN824NN",
    associatedRecords: [
      {
        reference: "KZYC5J",
        creationDate: "2022-10-26T07:55:00.000",
        originSystemCode: "GDS",
        flightOfferId: "1",
      },
    ],
    flightOffers: [
      {
        type: "flight-offer",
        id: "1",
        source: "GDS",
        nonHomogeneous: false,
        lastTicketingDate: "2022-10-27",
        itineraries: [
          {
            segments: [
              {
                departure: {
                  iataCode: "LGW",
                  terminal: "S",
                  at: "2022-11-16T17:25:00",
                },
                arrival: {
                  iataCode: "MAD",
                  terminal: "1",
                  at: "2022-11-16T20:55:00",
                },
                carrierCode: "UX",
                number: "1016",
                aircraft: {
                  code: "73H",
                },
                duration: "PT2H30M",
                id: "9",
                numberOfStops: 0,
                co2Emissions: [
                  {
                    weight: 125,
                    weightUnit: "KG",
                    cabin: "ECONOMY",
                  },
                ],
              },
            ],
          },
          {
            segments: [
              {
                departure: {
                  iataCode: "MAD",
                  terminal: "1",
                  at: "2022-12-01T07:35:00",
                },
                arrival: {
                  iataCode: "LGW",
                  terminal: "S",
                  at: "2022-12-01T09:00:00",
                },
                carrierCode: "UX",
                number: "1013",
                aircraft: {
                  code: "73H",
                },
                duration: "PT2H25M",
                id: "17",
                numberOfStops: 0,
                co2Emissions: [
                  {
                    weight: 125,
                    weightUnit: "KG",
                    cabin: "ECONOMY",
                  },
                ],
              },
            ],
          },
        ],
        price: {
          currency: "NGN",
          total: "81619.00",
          base: "25813.00",
          fees: [
            {
              amount: "0.00",
              type: "TICKETING",
            },
            {
              amount: "0.00",
              type: "SUPPLIER",
            },
            {
              amount: "0.00",
              type: "FORM_OF_PAYMENT",
            },
          ],
          grandTotal: "81619.00",
          billingCurrency: "NGN",
        },
        pricingOptions: {
          fareType: ["PUBLISHED"],
          includedCheckedBagsOnly: false,
        },
        validatingAirlineCodes: ["UX"],
        travelerPricings: [
          {
            travelerId: "1",
            fareOption: "STANDARD",
            travelerType: "ADULT",
            price: {
              currency: "NGN",
              total: "35314.00",
              base: "12410.00",
              taxes: [
                {
                  amount: "6453.00",
                  code: "GB",
                },
                {
                  amount: "6265.00",
                  code: "JD",
                },
                {
                  amount: "273.00",
                  code: "OG",
                },
                {
                  amount: "1415.00",
                  code: "QV",
                },
                {
                  amount: "8498.00",
                  code: "UB",
                },
              ],
              refundableTaxes: "22904.00",
            },
            fareDetailsBySegment: [
              {
                segmentId: "9",
                cabin: "ECONOMY",
                fareBasis: "ZYYR5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
              {
                segmentId: "17",
                cabin: "ECONOMY",
                fareBasis: "ZYYR5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
            ],
          },
          {
            travelerId: "2",
            fareOption: "STANDARD",
            travelerType: "CHILD",
            price: {
              currency: "NGN",
              total: "28861.00",
              base: "12410.00",
              taxes: [
                {
                  amount: "6265.00",
                  code: "JD",
                },
                {
                  amount: "273.00",
                  code: "OG",
                },
                {
                  amount: "1415.00",
                  code: "QV",
                },
                {
                  amount: "8498.00",
                  code: "UB",
                },
              ],
              refundableTaxes: "16451.00",
            },
            fareDetailsBySegment: [
              {
                segmentId: "9",
                cabin: "ECONOMY",
                fareBasis: "ZYYR5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
              {
                segmentId: "17",
                cabin: "ECONOMY",
                fareBasis: "ZYYR5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
            ],
          },
          {
            travelerId: "3",
            fareOption: "STANDARD",
            travelerType: "HELD_INFANT",
            associatedAdultId: "1",
            price: {
              currency: "NGN",
              total: "17444.00",
              base: "993.00",
              taxes: [
                {
                  amount: "6265.00",
                  code: "JD",
                },
                {
                  amount: "273.00",
                  code: "OG",
                },
                {
                  amount: "1415.00",
                  code: "QV",
                },
                {
                  amount: "8498.00",
                  code: "UB",
                },
              ],
              refundableTaxes: "16451.00",
            },
            fareDetailsBySegment: [
              {
                segmentId: "9",
                cabin: "ECONOMY",
                fareBasis: "ZYYR5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
              {
                segmentId: "17",
                cabin: "ECONOMY",
                fareBasis: "ZYYR5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
            ],
          },
        ],
      },
    ],
    travelers: [
      {
        id: "1",
        dateOfBirth: "1926-10-21",
        gender: "FEMALE",
        name: {
          firstName: "sheriff",
          lastName: "adeniyi",
        },
        documents: [
          {
            number: "A0181771",
            expiryDate: "2022-11-05",
            issuanceCountry: "NG",
            nationality: "NG",
            documentType: "PASSPORT",
            holder: true,
          },
        ],
        contact: {
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "234",
              number: "9065369929",
            },
          ],
          emailAddress: "gagag@ahaha.com.ng.call",
        },
      },
      {
        id: "2",
        dateOfBirth: "2016-10-20",
        gender: "FEMALE",
        name: {
          firstName: "sdsdcsds",
          lastName: "sddssdsddsdsd",
        },
        documents: [
          {
            number: "dsdsdsdsd",
            expiryDate: "2022-11-05",
            issuanceCountry: "NG",
            nationality: "NG",
            documentType: "PASSPORT",
            holder: true,
          },
        ],
        contact: {
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "234",
              number: "9065369929",
            },
          ],
          emailAddress: "gagag@ahaha.com.ng.call",
        },
      },
      {
        id: "3",
        dateOfBirth: "2021-10-13",
        gender: "FEMALE",
        name: {
          firstName: "ddddddsds",
          lastName: "dssdsddsdssdd",
        },
        documents: [
          {
            number: "dsdsdsd",
            expiryDate: "2022-11-05",
            issuanceCountry: "NG",
            nationality: "NG",
            documentType: "PASSPORT",
            holder: true,
          },
        ],
        contact: {
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "234",
              number: "9065369929",
            },
          ],
          emailAddress: "gagag@ahaha.com.ng.call",
        },
      },
    ],
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
    automatedProcess: [
      {
        code: "IMMEDIATE",
        queue: {
          number: "0",
          category: "0",
        },
        officeId: "NCE4D31SB",
      },
    ],
    contacts: [
      {
        addresseeName: {
          firstName: "ADENIYI SHERIFF",
        },
        address: {
          lines: ["G206 Ogba Multipupose Shopping Mall"],
          postalCode: "23401",
          countryCode: "NG",
          cityName: "Lagos",
        },
        purpose: "STANDARD",
        phones: [
          {
            deviceType: "MOBILE",
            countryCallingCode: "234",
            number: "9065369929",
          },
        ],
        companyName: "NAIJAGOINGABROAD LTD",
        emailAddress: "info@naijagoingabroad.com",
      },
    ],
  },
  dictionaries: {
    locations: {
      MAD: {
        cityCode: "MAD",
        countryCode: "ES",
      },
      LGW: {
        cityCode: "LON",
        countryCode: "GB",
      },
    },
  },
};

const offerPricing = {
  data: [
    {
      type: "flight-offer",
      id: "1",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      paymentCardRequired: false,
      lastTicketingDate: "2022-10-27",
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: "LGW",
                terminal: "S",
                at: "2022-11-16T17:25:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-11-16T20:55:00",
              },
              carrierCode: "UX",
              number: "1016",
              aircraft: {
                code: "73H",
              },
              operating: {
                carrierCode: "UX",
              },
              duration: "PT2H30M",
              id: "9",
              numberOfStops: 0,
              co2Emissions: [
                {
                  weight: 125,
                  weightUnit: "KG",
                  cabin: "ECONOMY",
                },
              ],
            },
          ],
        },
        {
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "1",
                at: "2022-12-01T07:35:00",
              },
              arrival: {
                iataCode: "LGW",
                terminal: "S",
                at: "2022-12-01T09:00:00",
              },
              carrierCode: "UX",
              number: "1013",
              aircraft: {
                code: "73H",
              },
              operating: {
                carrierCode: "UX",
              },
              duration: "PT2H25M",
              id: "17",
              numberOfStops: 0,
              co2Emissions: [
                {
                  weight: 125,
                  weightUnit: "KG",
                  cabin: "ECONOMY",
                },
              ],
            },
          ],
        },
      ],
      price: {
        currency: "NGN",
        total: "81619.00",
        base: "25813.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
          {
            amount: "0.00",
            type: "FORM_OF_PAYMENT",
          },
        ],
        grandTotal: "81619.00",
        billingCurrency: "NGN",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["UX"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "NGN",
            total: "35314",
            base: "12410",
            taxes: [
              {
                amount: "1415.00",
                code: "QV",
              },
              {
                amount: "273.00",
                code: "OG",
              },
              {
                amount: "6265.00",
                code: "JD",
              },
              {
                amount: "6453.00",
                code: "GB",
              },
              {
                amount: "8498.00",
                code: "UB",
              },
            ],
            refundableTaxes: "22904",
          },
          fareDetailsBySegment: [
            {
              segmentId: "9",
              cabin: "ECONOMY",
              fareBasis: "ZYYR5L",
              brandedFare: "LITE",
              class: "Z",
              includedCheckedBags: {
                quantity: 0,
              },
            },
            {
              segmentId: "17",
              cabin: "ECONOMY",
              fareBasis: "ZYYR5L",
              brandedFare: "LITE",
              class: "Z",
              includedCheckedBags: {
                quantity: 0,
              },
            },
          ],
        },
        {
          travelerId: "2",
          fareOption: "STANDARD",
          travelerType: "CHILD",
          price: {
            currency: "NGN",
            total: "28861",
            base: "12410",
            taxes: [
              {
                amount: "1415.00",
                code: "QV",
              },
              {
                amount: "273.00",
                code: "OG",
              },
              {
                amount: "6265.00",
                code: "JD",
              },
              {
                amount: "8498.00",
                code: "UB",
              },
            ],
            refundableTaxes: "16451",
          },
          fareDetailsBySegment: [
            {
              segmentId: "9",
              cabin: "ECONOMY",
              fareBasis: "ZYYR5L",
              brandedFare: "LITE",
              class: "Z",
              includedCheckedBags: {
                quantity: 0,
              },
            },
            {
              segmentId: "17",
              cabin: "ECONOMY",
              fareBasis: "ZYYR5L",
              brandedFare: "LITE",
              class: "Z",
              includedCheckedBags: {
                quantity: 0,
              },
            },
          ],
        },
        {
          travelerId: "3",
          fareOption: "STANDARD",
          travelerType: "HELD_INFANT",
          associatedAdultId: "1",
          price: {
            currency: "NGN",
            total: "17444",
            base: "993",
            taxes: [
              {
                amount: "1415.00",
                code: "QV",
              },
              {
                amount: "273.00",
                code: "OG",
              },
              {
                amount: "6265.00",
                code: "JD",
              },
              {
                amount: "8498.00",
                code: "UB",
              },
            ],
            refundableTaxes: "16451",
          },
          fareDetailsBySegment: [
            {
              segmentId: "9",
              cabin: "ECONOMY",
              fareBasis: "ZYYR5L",
              brandedFare: "LITE",
              class: "Z",
              includedCheckedBags: {
                quantity: 0,
              },
            },
            {
              segmentId: "17",
              cabin: "ECONOMY",
              fareBasis: "ZYYR5L",
              brandedFare: "LITE",
              class: "Z",
              includedCheckedBags: {
                quantity: 0,
              },
            },
          ],
        },
      ],
      trip: "return",
    },
  ],
  included: {
    "detailed-fare-rules": {
      1: {
        fareBasis: "ZYYR5L",
        name: "ECONOMY RT UNBUNDLED",
        fareNotes: {
          descriptions: [
            {
              descriptionType: "GENERAL INFORMATION",
              text: "RU.RULE APPLICATION UX LITE FARES APPLICATION AREA THESE FARES APPLY WITHIN AREA 2. CLASS OF SERVICE THESE FARES APPLY FOR ECONOMY CLASS SERVICE. TYPES OF TRANSPORTATION FARES GOVERNED BY THIS RULE CAN BE USED TO CREATE ONE-WAY/ROUND-TRIP/SINGLE OPEN-JAW/DOUBLE OPEN-JAW JOURNEYS. CAPACITY LIMITATIONS THE CARRIER SHALL LIMIT THE NUMBER OF PASSENGERS CARRIED ON ANY ONE FLIGHT AT FARES GOVERNED BY THIS RULE AND SUCH FARES WILL NOT NECESSARILY BE AVAILABLE ON ALL FLIGHTS. THE NUMBER OF SEATS WHICH THE CARRIER SHALL MAKE AVAILABLE ON A GIVEN FLIGHT WILL BE DETERMINED BY THE CARRIERS BEST JUDGMENT MN.MIN STAY NONE UNLESS OTHERWISE SPECIFIED MX.MAX STAY NONE UNLESS OTHERWISE SPECIFIED SR.SALES RESTRICT FROM/TO AREA 2 \nTICKETS MUST BE ISSUED ON UX  AND MAY NOT BE SOLD IN VENEZUELA/RUSSIA/RUSSIA (EAST OF THE URALS) AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3 TICKETS MAY NOT BE ISSUED BY PTA. EXTENSION OF TICKET VALIDITY IS NOT PERMITTED. AP.ADVANCE RES/TKT FROM/TO AREA 2 \nRESERVATIONS ARE REQUIRED FOR ALL SECTORS. WAITLIST NOT PERMITTED. WHEN RESERVATIONS ARE MADE AT LEAST 2 DAYS BEFORE DEPARTURE TICKETING MUST BE COMPLETED WITHIN 1 DAY AFTER RESERVATIONS ARE MADE. OR - RESERVATIONS FOR ALL SECTORS AND TICKETING MUST BE COMPLETED AT THE SAME TIME. NOTE - DIFFERENCE COULD EXIST BETWEEN THE CRS LAST TICKETING DATE AND TTL ROBOT REMARK. THE MOST RESTRICTIVE DATE PREVAILS. FL.FLT APPLICATION FROM/TO AREA 2 FOR ECONOMY RT UNBUNDLED FARES \nTHE FARE COMPONENT MUST BE ON ONE OR MORE OF THE FOLLOWING ANY UX FLIGHT OPERATED BY UX ANY 9B FLIGHT ANY W2 FLIGHT ANY AZ FLIGHT ANY A3 FLIGHT. CD.CHILD DISCOUNTS FROM/TO AREA 2 FOR ZYYR5L TYPE FARES \nACCOMPANIED CHILD 2-11 - CHARGE 100 PERCENT OF THE FARE. TICKET DESIGNATOR - CH. MUST BE ACCOMPANIED ON ALL FLIGHTS IN SAME COMPARTMENT BY ADULT 18 OR OLDER OR - UNACCOMPANIED CHILD 5-11 - CHARGE 100 PERCENT OF THE FARE. TICKET DESIGNATOR - CH. NOTE - AN ACCEPTANCE LIMIT ON THE NUMBER OF UNACCOMPANIED CHILD WILL BE CONSIDER OR - INFANT UNDER 2 WITH A SEAT - CHARGE 100 PERCENT OF THE FARE. TICKET DESIGNATOR - IN. MUST BE ACCOMPANIED ON ALL FLIGHTS IN SAME COMPARTMENT BY ADULT 18 OR OLDER. NOTE - AN INFANT UNDER TWO YEARS WHO MAY TURN 2 YEARS OF AGE BEFORE THE END OF THE TRIP MUST PAY A CHILD FARE FOR THE ENTIRE JOURNEY OR - 1ST INFANT UNDER 2 WITHOUT A SEAT - CHARGE 10 PERCENT OF THE FARE. TICKET DESIGNATOR - IN. MUST BE ACCOMPANIED ON ALL FLIGHTS IN SAME COMPARTMENT BY ADULT 18 OR OLDER. OD.OTHER DISCOUNTS NONE UNLESS OTHERWISE SPECIFIED SO.STOPOVERS FROM/TO AREA 2 \nNO STOPOVERS PERMITTED. TF.TRANSFERS/RTGS \nTRANSFERS PERMITTED FARE BREAK SURFACE SECTORS NOT PERMITTED AND EMBEDDED SURFACE SECTORS PERMITTED ON THE FARE COMPONENT. NOTE - TRANSFERS LIMITTED TO THE ROUTING MAP INDICATED IN THE FARE RECORD. SU.SURCHARGES NONE UNLESS OTHERWISE SPECIFIED CO.COMBINABILITY CIRCLE TRIPS NOT PERMITTED. APPLICABLE ADD-ON CONSTRUCTION IS ADDRESSED IN MISCELLANEOUS PROVISIONS - CATEGORY 23. END-ON-END END-ON-END COMBINATIONS PERMITTED. VALIDATE ALL FARE COMPONENTS. FARES MUST BE SHOWN SEPARATELY ON THE TICKET. TRAVEL MUST BE VIA THE POINT OF COMBINATION. SIDE TRIPS PERMITTED. PROVIDED - COMBINATIONS ARE WITH ANY ECONOMY OW UNBUNDLED/ECONOMY RT UNBUNDLED-TYPE FARES FOR CARRIER UX IN ANY RULE IN TARIFF IPREUAF - BETWEEN EUROPE-AFRICA IPREUME - BETWEEN EUROPE-THE MIDDLE EAST IPREURP - WITHIN EUROPE-INTERNATIONAL. OPEN JAWS/ROUND TRIPS FARES MAY BE COMBINED ON A HALF ROUND TRIP BASIS -TO FORM SINGLE OR DOUBLE OPEN JAWS. THE MILEAGE FOR AN INTERNATIONAL OPEN SEGMENT IS EQUAL TO OR LESS THAN THE MILEAGE FOR THE LONGEST FLOWN FARE COMPONENT. THERE IS NO MILEAGE RESTRICTION ON AN OPEN SEGMENT WITHIN ONE COUNTRY. OPEN JAWS NOTE - IN CASE OF COMBINATIONS FOR MORE RESTRICTIVE CONDITIONS APPLY TO THE WHOLE JOURNEY. -TO FORM ROUND TRIPS PROVIDED - COMBINATIONS ARE WITH ANY FARE FOR CARRIER UX IN RULE UW01/UW02/UW03/UW04 IN TARIFF FBRA2P  - WITHIN AREA 2 OR ANY RULE IN TARIFF IPREUAF - BETWEEN EUROPE-AFRICA IPREUME - BETWEEN EUROPE-THE MIDDLE EAST IPREURP - WITHIN EUROPE-INTERNATIONAL. HI.HIGHER INTERMEDIATE POINT \nTHE HIGHER INTERMEDIATE POINT RULE DOES NOT APPLY FOR CONNECTIONS. NOTE - DMC/HIP/EXCESS OF MILEAGE WILL NOT APPLY TO THESE FARES. AND - THE HIGHER INTERMEDIATE POINT RULE DOES NOT APPLY FOR STOPOVERS. NOTE - DMC/HIP/EXCESS OF MILEAGE WILL NOT APPLY TO THESE FARES. VC.VOLUNTARY CHANGES VOLUNTARY CHANGES CONDITIONS MAY APPLY FOR AUTOMATED REISSUE/REVALIDATION REFER TO PENALTIES CATEGORY *PE FOR DETAILS \nVR.VOLUNTARY REFUNDS VOLUNTARY CHANGES CONDITIONS MAY APPLY FOR AUTOMATED REFUNDS REFER TO PENALTIES CATEGORY *PE FOR DETAILS \n\n",
            },
            {
              descriptionType: "TICKET ENDORSMENT",
              text: "TE.TKT ENDORSEMENT \nTHE ORIGINAL AND THE REISSUED TICKET MUST BE ANNOTATED - CHGS AND REF RESTRICTED - IN THE ENDORSEMENT BOX. AND - THE ORIGINAL AND THE REISSUED TICKET MUST BE ANNOTATED - RESTRICTIONS APPLY - IN THE FORM OF PAYMENT BOX. ",
            },
            {
              descriptionType: "PENALTIES",
              text: "PE.PENALTIES FROM/TO AREA 2 FOR ECONOMY RT UNBUNDLED FARES \nCANCELLATIONS \nTICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW. \nANY TIME TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND. \nCHANGES \nCHANGES NOT PERMITTED IN CASE OF NO-SHOW. \nANY TIME CHARGE EUR 60.00 FOR REISSUE. CHILD/INFANT DISCOUNTS APPLY. \n\nNOTE - IN CASE OF PASSENGERS HOSPITAL ADMISSION OR DEATH OF PASSENGER OR FAMILY MEMBER PLEASE CONTACT WITH THE AIRLINE. CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET AND PERSON TO ALL PASSENGER TYPES. CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO ALL PASSENGER TYPES. ------------------------------ A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE CHANGE. IN CASE OF RESERVATION CHANGES AND REISSUE AFTER SCHEDULED FLIGHT CHANGES NOT PERMITED. OTHERWISE THE TICKET WILL ONLY BE VALID FOR REFUND IF APPLICABLE. ------------------------------ WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS WITH THE JOURNEY APPLIES. ------------------------------ WHEN COMBINING NON-REFUNDABLE FARES WITH A REFUNDABLE FARES 1-THE AMOUNT PAID ON EACH REFUNDABLE FARE COMPONENT IS REFUNDED 2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE COMPONENT WILL NOT BE REFUNDED 3-WHEN COMBINING FARES CHARGE THE SUM OF THE CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS ------------------------------ REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO THIRD PARTIES PERMITTED. ASSOCIATED CARRIER IMPOSED CHARGES WILL NOT BE REFUNDED. ------------------------------ REFUND AND CHANGES ARE PERMITTED WITHIN TICKET VALIDITY UNDER FARE CONDITIONS. ------------------------------ ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION PENALTY FROM A PREVIOUS TICKET REMAINS NON-REFUNDABLE FOLLOWING A CHANGE. ------------------------------ TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON. ---------------------------------------- ----REPRICING CONDITIONS ---- A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT FARE COMPONENT IS CHANGED THE ITINERARY MUST BE RE-PRICED USING CURRENT FARES IN EFFECT ON THE DATE THE TICKET IS REISSUED. B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE- PRICED USING HISTORICAL FARES IN EFFECT ON THE PREVIOUS TICKETING DATE OR USING CURRENT FARE IN EFFECT ON THE DATE THE TICKET IS REISSUED - WICHEVER IS LOWER. C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO CHANGES TO THE FIRST FARE COMPONENT BUT OTHER FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE PREVIOUS TICKETING DATE OR USING CURRENT FARES IN EFFECT ON THE DATE THE TICKET IS REISSUED - WHICHEVER IS LOWER. D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON THE PREVIOUS TICKETING DATE. ---------------------------------------- WHEN THE ITINERARY RESULT IN A HIGHER FARE THE DIFFERENCE WILL BE COLLECTED ANY APPLICABLE CHANGE FEE APPLIES. ---------------------------------------- WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE THE CHANGE FEE APPLIES AND NO CREDIT OF THE RESIDUAL AMOUNT WILL BE MADE. ",
            },
          ],
        },
        segmentId: "9",
      },
      2: {
        fareBasis: "ZYYR5L",
        name: "ECONOMY RT UNBUNDLED",
        fareNotes: {
          descriptions: [
            {
              descriptionType: "GENERAL INFORMATION",
              text: "RU.RULE APPLICATION UX LITE FARES APPLICATION AREA THESE FARES APPLY WITHIN AREA 2. CLASS OF SERVICE THESE FARES APPLY FOR ECONOMY CLASS SERVICE. TYPES OF TRANSPORTATION FARES GOVERNED BY THIS RULE CAN BE USED TO CREATE ONE-WAY/ROUND-TRIP/SINGLE OPEN-JAW/DOUBLE OPEN-JAW JOURNEYS. CAPACITY LIMITATIONS THE CARRIER SHALL LIMIT THE NUMBER OF PASSENGERS CARRIED ON ANY ONE FLIGHT AT FARES GOVERNED BY THIS RULE AND SUCH FARES WILL NOT NECESSARILY BE AVAILABLE ON ALL FLIGHTS. THE NUMBER OF SEATS WHICH THE CARRIER SHALL MAKE AVAILABLE ON A GIVEN FLIGHT WILL BE DETERMINED BY THE CARRIERS BEST JUDGMENT MN.MIN STAY NONE UNLESS OTHERWISE SPECIFIED MX.MAX STAY NONE UNLESS OTHERWISE SPECIFIED SR.SALES RESTRICT FROM/TO AREA 2 \nTICKETS MUST BE ISSUED ON UX  AND MAY NOT BE SOLD IN VENEZUELA/RUSSIA/RUSSIA (EAST OF THE URALS) AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3 TICKETS MAY NOT BE ISSUED BY PTA. EXTENSION OF TICKET VALIDITY IS NOT PERMITTED. AP.ADVANCE RES/TKT FROM/TO AREA 2 \nRESERVATIONS ARE REQUIRED FOR ALL SECTORS. WAITLIST NOT PERMITTED. WHEN RESERVATIONS ARE MADE AT LEAST 2 DAYS BEFORE DEPARTURE TICKETING MUST BE COMPLETED WITHIN 1 DAY AFTER RESERVATIONS ARE MADE. OR - RESERVATIONS FOR ALL SECTORS AND TICKETING MUST BE COMPLETED AT THE SAME TIME. NOTE - DIFFERENCE COULD EXIST BETWEEN THE CRS LAST TICKETING DATE AND TTL ROBOT REMARK. THE MOST RESTRICTIVE DATE PREVAILS. FL.FLT APPLICATION FROM/TO AREA 2 FOR ECONOMY RT UNBUNDLED FARES \nTHE FARE COMPONENT MUST BE ON ONE OR MORE OF THE FOLLOWING ANY UX FLIGHT OPERATED BY UX ANY 9B FLIGHT ANY W2 FLIGHT ANY AZ FLIGHT ANY A3 FLIGHT. CD.CHILD DISCOUNTS FROM/TO AREA 2 FOR ZYYR5L TYPE FARES \nACCOMPANIED CHILD 2-11 - CHARGE 100 PERCENT OF THE FARE. TICKET DESIGNATOR - CH. MUST BE ACCOMPANIED ON ALL FLIGHTS IN SAME COMPARTMENT BY ADULT 18 OR OLDER OR - UNACCOMPANIED CHILD 5-11 - CHARGE 100 PERCENT OF THE FARE. TICKET DESIGNATOR - CH. NOTE - AN ACCEPTANCE LIMIT ON THE NUMBER OF UNACCOMPANIED CHILD WILL BE CONSIDER OR - INFANT UNDER 2 WITH A SEAT - CHARGE 100 PERCENT OF THE FARE. TICKET DESIGNATOR - IN. MUST BE ACCOMPANIED ON ALL FLIGHTS IN SAME COMPARTMENT BY ADULT 18 OR OLDER. NOTE - AN INFANT UNDER TWO YEARS WHO MAY TURN 2 YEARS OF AGE BEFORE THE END OF THE TRIP MUST PAY A CHILD FARE FOR THE ENTIRE JOURNEY OR - 1ST INFANT UNDER 2 WITHOUT A SEAT - CHARGE 10 PERCENT OF THE FARE. TICKET DESIGNATOR - IN. MUST BE ACCOMPANIED ON ALL FLIGHTS IN SAME COMPARTMENT BY ADULT 18 OR OLDER. OD.OTHER DISCOUNTS NONE UNLESS OTHERWISE SPECIFIED SO.STOPOVERS FROM/TO AREA 2 \nNO STOPOVERS PERMITTED. TF.TRANSFERS/RTGS \nTRANSFERS PERMITTED FARE BREAK SURFACE SECTORS NOT PERMITTED AND EMBEDDED SURFACE SECTORS PERMITTED ON THE FARE COMPONENT. NOTE - TRANSFERS LIMITTED TO THE ROUTING MAP INDICATED IN THE FARE RECORD. SU.SURCHARGES NONE UNLESS OTHERWISE SPECIFIED CO.COMBINABILITY CIRCLE TRIPS NOT PERMITTED. APPLICABLE ADD-ON CONSTRUCTION IS ADDRESSED IN MISCELLANEOUS PROVISIONS - CATEGORY 23. END-ON-END END-ON-END COMBINATIONS PERMITTED. VALIDATE ALL FARE COMPONENTS. FARES MUST BE SHOWN SEPARATELY ON THE TICKET. TRAVEL MUST BE VIA THE POINT OF COMBINATION. SIDE TRIPS PERMITTED. PROVIDED - COMBINATIONS ARE WITH ANY ECONOMY OW UNBUNDLED/ECONOMY RT UNBUNDLED-TYPE FARES FOR CARRIER UX IN ANY RULE IN TARIFF IPREUAF - BETWEEN EUROPE-AFRICA IPREUME - BETWEEN EUROPE-THE MIDDLE EAST IPREURP - WITHIN EUROPE-INTERNATIONAL. OPEN JAWS/ROUND TRIPS FARES MAY BE COMBINED ON A HALF ROUND TRIP BASIS -TO FORM SINGLE OR DOUBLE OPEN JAWS. THE MILEAGE FOR AN INTERNATIONAL OPEN SEGMENT IS EQUAL TO OR LESS THAN THE MILEAGE FOR THE LONGEST FLOWN FARE COMPONENT. THERE IS NO MILEAGE RESTRICTION ON AN OPEN SEGMENT WITHIN ONE COUNTRY. OPEN JAWS NOTE - IN CASE OF COMBINATIONS FOR MORE RESTRICTIVE CONDITIONS APPLY TO THE WHOLE JOURNEY. -TO FORM ROUND TRIPS PROVIDED - COMBINATIONS ARE WITH ANY FARE FOR CARRIER UX IN RULE UW01/UW02/UW03/UW04 IN TARIFF FBRA2P  - WITHIN AREA 2 OR ANY RULE IN TARIFF IPREUAF - BETWEEN EUROPE-AFRICA IPREUME - BETWEEN EUROPE-THE MIDDLE EAST IPREURP - WITHIN EUROPE-INTERNATIONAL. HI.HIGHER INTERMEDIATE POINT \nTHE HIGHER INTERMEDIATE POINT RULE DOES NOT APPLY FOR CONNECTIONS. NOTE - DMC/HIP/EXCESS OF MILEAGE WILL NOT APPLY TO THESE FARES. AND - THE HIGHER INTERMEDIATE POINT RULE DOES NOT APPLY FOR STOPOVERS. NOTE - DMC/HIP/EXCESS OF MILEAGE WILL NOT APPLY TO THESE FARES. VC.VOLUNTARY CHANGES VOLUNTARY CHANGES CONDITIONS MAY APPLY FOR AUTOMATED REISSUE/REVALIDATION REFER TO PENALTIES CATEGORY *PE FOR DETAILS \nVR.VOLUNTARY REFUNDS VOLUNTARY CHANGES CONDITIONS MAY APPLY FOR AUTOMATED REFUNDS REFER TO PENALTIES CATEGORY *PE FOR DETAILS \n\n",
            },
            {
              descriptionType: "TICKET ENDORSMENT",
              text: "TE.TKT ENDORSEMENT \nTHE ORIGINAL AND THE REISSUED TICKET MUST BE ANNOTATED - CHGS AND REF RESTRICTED - IN THE ENDORSEMENT BOX. AND - THE ORIGINAL AND THE REISSUED TICKET MUST BE ANNOTATED - RESTRICTIONS APPLY - IN THE FORM OF PAYMENT BOX. ",
            },
            {
              descriptionType: "PENALTIES",
              text: "PE.PENALTIES FROM/TO AREA 2 FOR ECONOMY RT UNBUNDLED FARES \nCANCELLATIONS \nTICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW. \nANY TIME TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND. \nCHANGES \nCHANGES NOT PERMITTED IN CASE OF NO-SHOW. \nANY TIME CHARGE EUR 60.00 FOR REISSUE. CHILD/INFANT DISCOUNTS APPLY. \n\nNOTE - IN CASE OF PASSENGERS HOSPITAL ADMISSION OR DEATH OF PASSENGER OR FAMILY MEMBER PLEASE CONTACT WITH THE AIRLINE. CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET AND PERSON TO ALL PASSENGER TYPES. CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO ALL PASSENGER TYPES. ------------------------------ A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE CHANGE. IN CASE OF RESERVATION CHANGES AND REISSUE AFTER SCHEDULED FLIGHT CHANGES NOT PERMITED. OTHERWISE THE TICKET WILL ONLY BE VALID FOR REFUND IF APPLICABLE. ------------------------------ WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS WITH THE JOURNEY APPLIES. ------------------------------ WHEN COMBINING NON-REFUNDABLE FARES WITH A REFUNDABLE FARES 1-THE AMOUNT PAID ON EACH REFUNDABLE FARE COMPONENT IS REFUNDED 2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE COMPONENT WILL NOT BE REFUNDED 3-WHEN COMBINING FARES CHARGE THE SUM OF THE CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS ------------------------------ REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO THIRD PARTIES PERMITTED. ASSOCIATED CARRIER IMPOSED CHARGES WILL NOT BE REFUNDED. ------------------------------ REFUND AND CHANGES ARE PERMITTED WITHIN TICKET VALIDITY UNDER FARE CONDITIONS. ------------------------------ ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION PENALTY FROM A PREVIOUS TICKET REMAINS NON-REFUNDABLE FOLLOWING A CHANGE. ------------------------------ TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON. ---------------------------------------- ----REPRICING CONDITIONS ---- A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT FARE COMPONENT IS CHANGED THE ITINERARY MUST BE RE-PRICED USING CURRENT FARES IN EFFECT ON THE DATE THE TICKET IS REISSUED. B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE- PRICED USING HISTORICAL FARES IN EFFECT ON THE PREVIOUS TICKETING DATE OR USING CURRENT FARE IN EFFECT ON THE DATE THE TICKET IS REISSUED - WICHEVER IS LOWER. C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO CHANGES TO THE FIRST FARE COMPONENT BUT OTHER FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE PREVIOUS TICKETING DATE OR USING CURRENT FARES IN EFFECT ON THE DATE THE TICKET IS REISSUED - WHICHEVER IS LOWER. D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON THE PREVIOUS TICKETING DATE. ---------------------------------------- WHEN THE ITINERARY RESULT IN A HIGHER FARE THE DIFFERENCE WILL BE COLLECTED ANY APPLICABLE CHANGE FEE APPLIES. ---------------------------------------- WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE THE CHANGE FEE APPLIES AND NO CREDIT OF THE RESIDUAL AMOUNT WILL BE MADE. ",
            },
          ],
        },
        segmentId: "17",
      },
    },
  },
  dictionaries: {
    locations: {
      MAD: {
        cityCode: "MAD",
        countryCode: "ES",
      },
      LGW: {
        cityCode: "LON",
        countryCode: "GB",
      },
    },
  },
};

const offer = first(get(offerPricing, "data", []));

const passengerData = {
  phone: "2349065369929",
  email: "sheriph4real@gmail.com",
  travelersData: [
    {
      title: "Mr",
      lastname: "adeniyi",
      firstname: "sheriff subair omo baba",
      travelerType: "ADULT",
      travelerId: "118",
    },
    {
      travelerType: "CHILD",
      travelerId: "119",
      firstname: "fdffs",
      title: "Mr",
      lastname: "sddssdsddsdsd",
    },
    {
      travelerType: "INFANT",
      travelerId: "120",
      firstname: "sjkshjs",
      title: "Ms",
      lastname: "dssdsddsdssdd",
    },
  ],
  payment: "Online Debit/Credit Card",
};

const visaOrderParams = {
  "Hotel Reservation For Visa": {
    price: 5000,
    selected: true,
    type: "product",
  },
  "Flight Reservation For Visa": {
    price: 5000,
    selected: true,
    type: "product",
  },
  "Application Form Filling": {
    price: 10000,
    selected: true,
    type: "product",
  },
  "Embassy Appointment Booking": {
    price: 5000,
    selected: true,
    type: "product",
  },
  passengers: {
    adult: 1,
    child: 1,
    infant: 1,
  },
  "Departure City, Country": "Lagos, Nigeria",
  "Arrival City, Country": "London, UK",
  "Arrival Date": "2022-11-16T23:00:00.000Z",
  "Return Date": "2022-12-30T23:00:00.000Z",
};
