import { get } from "lodash";
import { MongoClient, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function handler(req, res) {
  const { reference, lastname } = req.body;
  console.log({ reference, lastname });
  try {
    await client.connect();
    const query = {
      "flightOrder.data.associatedRecords.reference": reference,
      "flightOrder.data.travelers.name.lastName": lastname,
    };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: {},
    };
    const order = await client
      .db("nga")
      .collection("flightorder")
      .findOne(query);
    // console.log("posts", posts);
    await client.close();
    res.status(200).json(order);
  } catch (err) {
    console.log(`err`, err.response);
    await client.close();
    res.status(400).json(err.response);
  }
}
