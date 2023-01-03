import { get } from "lodash";
import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);

    console.time("getPostTimer");
    const client = await clientPromise;
    const { key } = req.body;

    const [postType, id] = key.split("-");
    console.log("postType", postType, id);

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
    res.status(200).json(posts);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  }
}
