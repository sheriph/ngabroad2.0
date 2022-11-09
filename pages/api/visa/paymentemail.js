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
  MjmlTable,
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
import { money, titleCase } from "../../../lib/utility";

const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

export default async function generateEmail(req, res) {
  //

  console.time("start");

  const { passengerData, visaOrderParams, reference } = req.body;
  // console.log("flightOffer", flightOffer);

  const values = [
    visaOrderParams["Application Form Filling"],
    visaOrderParams["Embassy Appointment Booking"],
    visaOrderParams["Flight Reservation For Visa"],
    visaOrderParams["Hotel Reservation For Visa"],
  ]
    .filter((value) => value.selected)
    .reduce((a, b) => a + b.price, 0);

  // const startLocation = await getLocationName(startIataCode, req, res);

  const { html, errors } = render(
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{`Order Reference : ${reference}`}</MjmlTitle>
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
              Payment Received
            </MjmlText>
            <MjmlText
              fontSize={16}
              fontWeight={500}
              color="#FFFFFF"
              align="center"
            >
              {reference}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection backgroundColor={"#FFFFFF"}>
          <MjmlColumn>
            <MjmlText>
              We have confirmed payment for this order. Thank you for using our
              services. Rest assured that your order is receiving our full
              attention and should be ready soon.
            </MjmlText>
            <MjmlText>
              Payment Date: {dayjs().format("Do MMM YYYY [at] hh:mma")}{" "}
            </MjmlText>
            <MjmlText>Total : {money(values)} </MjmlText>
          </MjmlColumn>
        </MjmlSection>

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
            {get(passengerData, "travelersData", []).map((traveler, index) => {
              const { firstname, lastname, title, travelerType } = traveler;
              return (
                <MjmlText
                  paddingTop={0}
                  paddingBottom={5}
                  fontWeight={500}
                  align="left"
                  key={index}
                >
                  {`${title} ${titleCase(firstname)}`}{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {titleCase(lastname)}
                  </span>{" "}
                  ({titleCase(travelerType)})
                </MjmlText>
              );
            })}
            <MjmlText fontWeight={500} paddingBottom="10px" align="left">
              {get(passengerData, "email", "")} ||{" "}
              {get(passengerData, "phone", "")}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection padding="10px 0px 10px 0px">
          <MjmlColumn>
            <MjmlText
              fontWeight={500}
              paddingBottom="10px"
              color="#5348dc"
              align="left"
            >
              Order Information
            </MjmlText>

            <MjmlTable>
              {Object.entries(visaOrderParams || {}).map((product, index) => {
                const [productName, value] = product;
                // @ts-ignore
                if (typeof value === "string") {
                  return (
                    <tr key={index}>
                      <td>{productName}</td>
                      <td>
                        {dayjs(value).isValid()
                          ? dayjs(value).format("DD MMM YYYY")
                          : value}
                      </td>
                    </tr>
                  );
                }
              })}
            </MjmlTable>

            <MjmlTable>
              {Object.entries(visaOrderParams || {}).map((product, index) => {
                const [productName, value] = product;
                // @ts-ignore
                if (value?.selected) {
                  return (
                    <tr key={index}>
                      <td>{productName}</td>
                      <td>
                        {money(
                          // @ts-ignore
                          value.price
                        )}
                      </td>
                    </tr>
                  );
                }
              })}
            </MjmlTable>
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
      to: [get(passengerData, "email", "")],
      cc: ["info@naijagoingabroad.com"],
      html,
      subject: `Payment Received : ${reference}`,
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
