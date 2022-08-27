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
    const { title } = req.body;
    console.log(`req.body`, title);

    await client.connect();
    const query = { title: title };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: { _id: 1, title: 1, slug: 1 },
    };
    const response = await client
      .db("nga")
      .collection("posts")
      .findOne(query, options);

    console.log("response", response);

    res.status(200).json(response);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
