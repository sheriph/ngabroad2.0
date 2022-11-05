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

    console.time("getPostTimer");

    const { key } = req.body;

    const [postType, id] = key.split("-");
    console.log("postType", postType, id);

    await client.connect();
    const query = { post_type: postType, user_id: new ObjectId(id) };

    const options = {
      // sorting
      sort: {},
      //what to return
      projection: {},
    };
    const posts = await client
      .db("nga")
      .collection("posts")
      .countDocuments(query);

    console.timeEnd("getPostTimer");
    await client.close();
    res.status(200).json(posts);
  } catch (err) {
    console.log(`err`, err);
    await client.close();
    res.status(400).json(err);
  }
}
