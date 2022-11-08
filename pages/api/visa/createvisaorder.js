import { truncate } from "lodash";
import { MongoClient, ServerApiVersion } from "mongodb";
import { postSchema } from "../../../lib/mongodb/schema";
import { seoSlug } from "../../../lib/utility";
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
  try {
    const { reference, visaOrderParams, passengerData } = req.body;
    const newOrder = { reference, visaOrderParams, passengerData };

    await client.connect();

    await client.db("nga").collection("visaorders").insertOne(newOrder);
    await client.close();
    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    await client.close();
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
