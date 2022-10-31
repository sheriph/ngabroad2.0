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

export default async function handler(req, res) {
  const { offerPricing, flightOrder } = req.body;
  console.log("SAVE ORDER");

  try {
    await client.connect();

    const createdOrder = {
      offerPricing,
      flightOrder,
    };

    await client.db("nga").collection("flightorder").insertOne(createdOrder);

    res.status(200).json(createdOrder);
  } catch (error) {
    console.log("error", error.response.data);
    res.status(400).json(error.response.data);
  }
}
