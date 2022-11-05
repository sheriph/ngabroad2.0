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
  try {
    // console.log(`req.body`, req.body);

    const { post_id } = req.body;
    console.log("post_id", post_id);
    await client.connect();
    const query = { post_id: new ObjectId(post_id) };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: { post_id: 1, user_id: 1, status: 1 },
    };
    const votes = await client
      .db("nga")
      .collection("votes")
      .find(query, options)
      .toArray();
    console.log("votes", votes);
    await client.close();
    res.status(200).json(votes);
  } catch (err) {
    console.log(`err`, err);
    await client.close();
    res.status(400).json(err);
  }
}
