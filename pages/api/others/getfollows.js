import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);
    const client = await clientPromise;
    const { user_id } = req.body;
    console.log("user_id", user_id);

    const query = { user_id: new ObjectId(user_id) };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: { post_id: 1 },
    };
    const follows = await client
      .db("nga")
      .collection("follows")
      .countDocuments(query);
    console.log("follows", follows);
    res.status(200).json(follows);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  }
}
