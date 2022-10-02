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

    const { user_id } = req.body;
    console.log("user_id", user_id);
    await client.connect();
    const query = { user_id: new ObjectId(user_id) };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: {},
    };
    const posts = await client
      .db("nga")
      .collection("posts")
      .find(query, options)
      .toArray();
    console.log("posts", posts);
    await client.close();
    res.status(200).json(posts);
  } catch (err) {
    console.log(`err`, err);
    await client.close();
    res.status(400).json(err);
  }
}
