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

export default async function handler(req, res) {
  try {
    const { reference } = req.body;
    console.log("reference", reference);
    const query = { reference: reference };
    await client.connect();
    const order = await client
      .db("nga")
      .collection("visaorders")
      .findOne(query);
    if (!order) throw new Error("Not Found");
    await client.close();
    console.log("order", order);
    res.status(200).json(order);
  } catch (error) {
    console.log("error.message order", error.message);
    await client.close();
    res.status(400).json(error.message);
  }
}
