// pages/api/generate-email.js
import React from "react";
import {
  render,
  Mjml,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlGroup,
  MjmlDivider,
  MjmlTitle,
  MjmlAccordion,
  MjmlAccordionElement,
  MjmlAccordionTitle,
  MjmlAccordionText,
  MjmlButton,
  MjmlWrapper,
  MjmlSpacer,
  MjmlRaw,
  MjmlHead,
} from "mjml-react";
import {
  find,
  first,
  get,
  last,
  lowerCase,
  sortBy,
  startCase,
  uniqBy,
} from "lodash";
import dayjs from "dayjs";
import { titleCase } from "../../../lib/utility";


const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

const getLocationName = (res, isAirport, showCountry) => {
  return isAirport
    ? `${`${titleCase(get(res, "name", ""))}, ${titleCase(
        get(res, "address.cityName", "")
      )} (${get(res, "iataCode", "")})`} ${
        showCountry ? titleCase(get(res, "address.countryName", "")) : ""
      }`
    : `${titleCase(get(res, "address.cityName", ""))} ${
        showCountry ? titleCase(get(res, "address.countryName", "")) : ""
      }`;
};

export default async function generateEmail(req, res) {
  //

  console.time("start");

  const { flightOffer, flightOrder, offerPricing2 } = req.body;
  // console.log("flightOffer", flightOffer);

  //console.log("offer", offer);

  const prices = sortBy(
    uniqBy(
      get(flightOffer, "travelerPricings", []).map((traveler) => ({
        travelerType: get(traveler, "travelerType", ""),
        price: get(traveler, "price.total", ""),
      })),
      "travelerType"
    ),
    ["travelerType"]
  );

  const startIataCode = get(
    first(get(first(get(flightOffer, "itineraries", [])), "segments", [])),
    "departure.iataCode",
    ""
  );

  // console.log("startIataCode", startIataCode);

  const endIataCode = get(
    last(get(last(get(flightOffer, "itineraries", [])), "segments", [])),
    "arrival.iataCode",
    ""
  );

  const endIataCode2 = get(
    first(get(last(get(flightOffer, "itineraries", [])), "segments", [])),
    "departure.iataCode",
    ""
  );

  // @ts-ignore
  const trip = flightOffer?.trip;

  // console.log("endIataCode2", startIataCode, endIataCode, endIataCode2, trip);

  const reference = get(
    find(get(flightOrder, "data.associatedRecords", []), {
      originSystemCode: "GDS",
    }),
    "reference",
    ""
  );

  const bookingDate = get(
    find(get(flightOrder, "data.associatedRecords", []), {
      originSystemCode: "GDS",
    }),
    "creationDate",
    null
  );

  // const startLocation = await getLocationName(startIataCode, req, res);

  const { html, errors } = render(
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{`Your Flight Booking : ${reference}`}</MjmlTitle>
      </MjmlHead>
      <MjmlBody>
        <MjmlSection backgroundColor={"#5348dc"}>
          <MjmlColumn>
            <MjmlText
              fontSize={16}
              fontWeight={500}
              color="#FFFFFF"
              align="center"
            >
              Booking Confirmed
            </MjmlText>
            <MjmlText
              fontSize={16}
              fontWeight={500}
              color="#FFFFFF"
              align="center"
            >
              Reference {reference}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection backgroundColor={"#FFFFFF"}>
          <MjmlColumn>
            <MjmlText>
              This booking will only be valid for a maximum of 24 hours unless
              payment is confirmed. We encourage you to pay as soon as possible.
              Thank you
            </MjmlText>
            <MjmlText>
              Booking Date:{" "}
              {dayjs(bookingDate).format("Do MMM YYYY [at] hh:mma")}{" "}
            </MjmlText>
            <MjmlText align="left">
              Bank Details: Naijagoingabroad Ltd, 0124782295, Stanbic Ibtc
            </MjmlText>
            <MjmlButton>Click Here To Pay Online</MjmlButton>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection padding="0px">
          <MjmlColumn>
            <MjmlText
              fontSize="11px"
              fontWeight={500}
              color="#5348dc"
              align="left"
            >
              {getLocationName(startIataCode, false, false)} {"-"}{" "}
              {trip === "multi"
                ? "Multiple Destinations"
                : getLocationName(
                    trip === "return" ? endIataCode2 : endIataCode,
                    false,
                    false
                  )}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        {get(flightOffer, "itineraries", []).map(
          (itinerary, itineraryIndex, itineraries) => {
            return (
              <MjmlWrapper key={itineraryIndex}>
                {get(itinerary, "segments", []).map(
                  (segment, index, segments) => {
                    const departureTime = get(segment, "departure.at", "");
                    const arrivalTime = get(segment, "arrival.at", "");

                    const lastSegment = Boolean(segments.length === index + 1);

                    const arrivalTimeLastSegment = get(
                      last(segments),
                      "arrival.at",
                      ""
                    );

                    const nextItin = itineraries[itineraryIndex + 1];

                    const depTimeNextItinFirstSeg = get(
                      first(get(nextItin, "segments", [])),
                      "departure.at",
                      ""
                    );

                    const stay = Math.ceil(
                      dayjs(depTimeNextItinFirstSeg).diff(
                        arrivalTimeLastSegment,
                        "days",
                        true
                      )
                    );

                    const nextSegment = segments[index + 1];

                    const depTimeNextSegment = get(
                      nextSegment,
                      "departure.at",
                      ""
                    );

                    const layover = dayjs(depTimeNextSegment).diff(
                      arrivalTime,
                      "m"
                    );

                    const classOfBooking = get(
                      find(
                        get(
                          first(get(flightOffer, "travelerPricings", [])),
                          "fareDetailsBySegment",
                          []
                        ),
                        { segmentId: get(segment, "id", "") }
                      ),
                      "class",
                      ""
                    );

                    const cabin = startCase(
                      lowerCase(
                        get(
                          find(
                            get(
                              first(get(flightOffer, "travelerPricings", [])),
                              "fareDetailsBySegment",
                              []
                            ),
                            { segmentId: get(segment, "id", "") }
                          ),
                          "cabin",
                          ""
                        )
                      )
                    );

                    const bags = sortBy(
                      uniqBy(
                        get(flightOffer, "travelerPricings", []).map(
                          (traveler) => ({
                            travelerType: get(traveler, "travelerType", ""),
                            segmentBagQty: get(
                              find(get(traveler, "fareDetailsBySegment", []), {
                                segmentId: get(segment, "id", ""),
                              }),
                              "includedCheckedBags.quantity",
                              ""
                            ),
                          })
                        ),
                        "travelerType"
                      ),
                      ["travelerType"]
                    );
                    return (
                      <MjmlSection
                        key={index}
                        padding="10px 0px"
                        backgroundColor="#EFEFEF"
                      >
                        <MjmlGroup width="100%" backgroundColor="#EFEFEF">
                          <MjmlColumn
                            paddingLeft="0px"
                            paddingRight="0px"
                            width="35%"
                          >
                            <MjmlText fontSize="11px" paddingBottom="0px">
                              {getLocationName(
                                get(segment, "departure.iataCode", {}),
                                false,
                                false
                              )}
                            </MjmlText>
                            <MjmlText  fontSize="11px" paddingBottom="0px">
                              {getLocationName(
                                get(segment, "departure.iataCode", {}),
                                true,
                                false
                              )}
                            </MjmlText>
                            <MjmlText  fontSize="11px" paddingBottom="0px">
                              {dayjs(
                                get(segment, "departure.at", new Date())
                              ).format("ddd MMM DD h:mma")}
                            </MjmlText>
                          </MjmlColumn>
                          <MjmlColumn
                            paddingLeft="0px"
                            paddingRight="0px"
                            width="25%"
                          >
                            <MjmlText  fontSize="11px" paddingBottom="0px" align="center">
                              {titleCase(get(segment, "carrierCode", ""))}
                            </MjmlText>
                            <MjmlDivider
                              borderWidth="1px"
                              padding="10px 0px 0px 0px"
                            />
                            <MjmlText  fontSize="11px" paddingBottom="0px" align="center">
                              {titleCase(cabin)}
                            </MjmlText>
                          </MjmlColumn>
                          <MjmlColumn
                            paddingLeft="0px"
                            paddingRight="0px"
                            width="35%"
                          >
                            <MjmlText  fontSize="11px" paddingBottom="0px">
                              {getLocationName(
                                get(segment, "arrival.iataCode", {}),
                                false,
                                false
                              )}
                            </MjmlText>
                            <MjmlText  fontSize="11px" paddingBottom="0px">
                              {getLocationName(
                                get(segment, "arrival.iataCode", {}),
                                true,
                                false
                              )}
                            </MjmlText>
                            <MjmlText  fontSize="11px" paddingBottom="0px">
                              {dayjs(
                                get(segment, "arrival.at", new Date())
                              ).format("ddd MMM DD h:mma")}
                            </MjmlText>
                          </MjmlColumn>
                        </MjmlGroup>
                        <MjmlColumn width="100%">
                          <MjmlText align="left" fontSize={10}>
                            Bags:{" "}
                            {bags.map(
                              (bag, index, bags) =>
                                `${
                                  // @ts-ignore
                                  bag.segmentBagQty
                                    ? // @ts-ignore
                                      `${titleCase(bag.travelerType)} ${
                                        // @ts-ignore
                                        bag.segmentBagQty
                                      }x23kg`
                                    : // @ts-ignore
                                      `${titleCase(
                                        // @ts-ignore
                                        bag.travelerType
                                      ).replace("Held_", "")} 0`
                                } `
                            )}
                          </MjmlText>
                        </MjmlColumn>
                      </MjmlSection>
                    );
                  }
                )}
              </MjmlWrapper>
            );
          }
        )}

        {/* <MjmlSection padding="10px 0px 10px 0px">
          <MjmlColumn>
            <MjmlText
              fontWeight={500}
              paddingBottom="10px"
              color="#5348dc"
              align="left"
            >
              References
            </MjmlText>
            <MjmlText
              paddingTop={0}
              paddingBottom={5}
              fontWeight={500}
              align="left"
            >
              NGabroad Reference: RHABAJAJA
            </MjmlText>
            <MjmlText
              paddingTop={0}
              paddingBottom={5}
              fontWeight={500}
              align="left"
            >
              Qatar Airways Reference: SHAKAHSJS
            </MjmlText>
          </MjmlColumn>
        </MjmlSection> */}
        <MjmlSection padding="10px 0px 10px 0px">
          <MjmlColumn>
            <MjmlText
              fontWeight={500}
              paddingBottom="10px"
              color="#5348dc"
              align="left"
            >
              Passenger(s)
            </MjmlText>
            {get(flightOrder, "data.travelers", []).map((traveler, index) => (
              <MjmlText
                paddingTop={0}
                paddingBottom={5}
                fontWeight={500}
                align="left"
                key={index}
              >
                {titleCase(get(traveler, "name.lastName", ""))}{" "}
                {titleCase(get(traveler, "name.firstName", ""))}
              </MjmlText>
            ))}
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlAccordion>
              <MjmlAccordionElement
                icon-wrapped-url="https://i.imgur.com/Xvw0vjq.png"
                icon-unwrapped-url="https://i.imgur.com/KKHenWa.png"
                icon-height="24px"
                icon-width="24px"
              >
                <MjmlAccordionTitle fontSize={16} color="#5348dc">
                  Ticket Conditions
                </MjmlAccordionTitle>
                <MjmlAccordionText>
                  {uniqBy(
                    Array.from(
                      Object.values(
                        get(
                          offerPricing2,
                          `included["detailed-fare-rules"]`,
                          {}
                        )
                      )
                    ),
                    "fareBasis"
                  ).map((rule, index) => (
                    <MjmlText key={index}>
                      {titleCase(rule.name)} - {rule.fareBasis}
                      <MjmlRaw>
                        <br />
                      </MjmlRaw>
                      <MjmlRaw>
                        <br />
                      </MjmlRaw>
                      {titleCase(
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
                    </MjmlText>
                  ))}
                </MjmlAccordionText>
              </MjmlAccordionElement>
            </MjmlAccordion>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>,
    { validationLevel: "soft" }
  );

  if (Boolean(errors.length)) {
    return res.status(500).json({
      errors,
    });
  }

  let nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

    transporter.sendMail(
    {
      from: "info@naijagoingabroad.com",
      to: [
        "sheriph4real@gmail.com",
        get(
          first(get(flightOrder, "data.travelers", [])),
          "contact.emailAddress",
          ""
        ),
      ],
      html,
      subject: `Your Flight Booking : ${reference}`,
      // text: html,
    },
    (err, info) => {
      if (info) {
        console.log("info", info);
      }
      if (err) {
        // handle error
        console.log("err", err);
      }
    }
  );

  console.timeEnd("start");

  return res.send(html);
}
