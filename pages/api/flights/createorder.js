import { getCookie } from "cookies-next";
import { setCookie } from "cookies-next";
import axios from "axios";
import { first, truncate } from "lodash";
import { MongoClient, ServerApiVersion } from "mongodb";
const ObjectID = require("mongodb").ObjectId;
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  serverApi: ServerApiVersion.v1,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);
import { get } from "lodash";

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
  const { data, offerPricing, payment } = req.body;
  console.log("FLIGHT CREATE ORDER");

  try {
    await client.connect();
    if (!getCookie("accessToken", { req, res })) {
      // @ts-ignore
      const response = await axios(tokenConfig);

      console.log("response.data", response.data);

      setCookie("accessToken", response.data.access_token, {
        req,
        res,
        maxAge: response.data.expires_in,
        sameSite: "none",
        httpOnly: true,
      });
    }

    console.log("token", getCookie("accessToken", { req, res }));

    const config = {
      method: "post",
      url: "https://test.api.amadeus.com/v1/booking/flight-orders",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken", {
          req,
          res,
        })}`,
      },
      data: data,
    };

    // @ts-ignore
    const response = await axios(config);

    const createdOrder = {
      payment,
      offerPricing: offerPricing,
      flightOrder: response.data,
    };

    await client.db("nga").collection("flightorder").insertOne(createdOrder);

    res.status(200).json(createdOrder);
  } catch (error) {
    console.log("error", error.response.data);
    res.status(400).json(error.response.data);
  }
}
