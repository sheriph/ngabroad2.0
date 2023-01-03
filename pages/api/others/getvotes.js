import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);
    const client = await clientPromise;
    const { post_id } = req.body;
    console.log("post_id", post_id);
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
    res.status(200).json(votes);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  }
}
