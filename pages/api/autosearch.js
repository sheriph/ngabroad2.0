import { get } from "lodash";
import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function handler(req, res) {
  try {
    const { text } = req.body;
    console.log(`req.body`, text);

    await client.connect();

    const response = await client
      .db("nga")
      .collection("posts")
      .find({ $text: { $search: text } });
    const resToArray = await response.toArray();
    console.log("response", resToArray);

    res.status(200).json(resToArray);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
