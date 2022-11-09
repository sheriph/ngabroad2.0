import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { userSchema } from "../../../lib/mongodb/schema";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  serverApi: ServerApiVersion.v1,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

const Flutterwave = require("flutterwave-node-v3");

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

export default async function handler(req, res) {
  const { reference, paymentId, amount, currency } = req.body;
  console.log("reference", reference, paymentId, amount);

  flw.Transaction.verify({ id: paymentId }).then(async (response) => {
    console.log("response.data", response.data);
    if (
      response.data.status === "successful" &&
      response.data.amount === amount &&
      response.data.currency === currency
    ) {
      // Success! Confirm the customer's payment
      console.log("success not updating datapage");
      await client.connect();
      await client
        .db("nga")
        .collection("visaorders")
        .updateOne({ reference }, { $set: { paymentStatus: "paid" } });
      await client.close();
      res.status(200).json(true);
    } else {
      // Inform the customer their payment was unsuccessful
      res.status(400).json("Payment mismatch error");
    }
  });
}
