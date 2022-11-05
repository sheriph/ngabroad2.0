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
    await client.connect();
    const query = { post_id: new ObjectId(post_id) };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: {},
    };
    const commentCount = await client
      .db("nga")
      .collection("postscomments")
      .countDocuments(query);
    console.log("commentCount", commentCount);
    await client.close();
    res.status(200).json(commentCount);
  } catch (err) {
    console.log(`err`, err);
    await client.close();
    res.status(400).json(err);
  }
}
