import { get } from "lodash";
import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);

    console.time("getPostTimer");
    const client = await clientPromise;
    const { user_id } = req.body;

    const query = { user_id: new ObjectId(user_id) };

    const posts = await client
      .db("nga")
      .collection("posts")
      .countDocuments(query);
      
    res.status(200).json(posts);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  }
}
