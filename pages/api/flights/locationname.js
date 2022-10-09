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
  const { iataCode } = req.body;
  console.log("iataCode", iataCode);

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

    const config = {
      method: "get",
      url: `https://test.api.amadeus.com/v1/reference-data/locations/A${iataCode}`,
      headers: {
        Authorization: `Bearer ${getCookie("accessToken", { req, res })}`,
      },
    };
    // @ts-ignore
    const response = await axios(config);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json(error);
  }
}
