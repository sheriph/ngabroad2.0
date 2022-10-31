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
  console.log("get cookie");
  try {
    // @ts-ignore
    const response = await axios(tokenConfig);

    console.log("response.data", response.data);

    /* setCookie("accessToken", response.data.access_token, {
      req,
      res,
      maxAge: response.data.expires_in,
      sameSite: "none",
      httpOnly: true,
    }); */

    res.status(200).json(response.data);
  } catch (error) {
    console.log("error", error.response.data);
    res.status(400).json(error.response.data);
  }
}
