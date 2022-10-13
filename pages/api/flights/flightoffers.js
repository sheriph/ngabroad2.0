import { getCookie } from "cookies-next";
import { setCookie } from "cookies-next";
import axios from "axios";

var qs = require("qs");
var data = qs.stringify({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: "client_credentials",
});
var tokenConfig = {
  method: "post",
  url: "https://test.api.amadeus.com/v1/security/oauth2/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: data,
};

export default async function handler(req, res) {
  const { data } = req.body;
  // console.log("keyword", keyword);

  try {
    if (!getCookie("accessToken", { req, res })) {
      // @ts-ignore
      const response = await axios(tokenConfig);

      console.log("response.data", response.data);

      setCookie("accessToken", response.data.access_token, {
        req,
        res,
        maxAge: response.data.expires_in,
        httpOnly: true,
      });
    }

    console.log("token", getCookie("accessToken", { req, res }));

    //originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2022-11-01&returnDate=2022-11-18&adults=1&children=0&infants=0&travelClass=ECONOMY

    /*     const config = {
      method: "get",
      url: `https://test.api.amadeus.com/v2/shopping/flight-offers?${keyword}`,
      headers: {
        Authorization: `Bearer ${getCookie("accessToken", { req, res })}`,
      },
    }; */

    const config = {
      method: "post",
      url: "https://test.api.amadeus.com/v2/shopping/flight-offers",
      headers: {
        "Content-Type": "application/json",
        "X-HTTP-Method-Override": "GET",
        Authorization: `Bearer ${getCookie("accessToken", { req, res })}`,
      },
      data: data,
    };

    // @ts-ignore
    const response = await axios(config);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json(error);
  }
}
