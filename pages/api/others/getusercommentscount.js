import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);

    console.time("getPostTimer");
    const client = await clientPromise;
    const { user_id } = req.body;
    console.log("user_id", user_id);

    const query = { user_id: new ObjectId(user_id) };

    const options = {
      // sorting
      sort: {},
      //what to return
      projection: {},
    };
    const posts = await client
      .db("nga")
      .collection("postscomments")
      .countDocuments(query);

    console.timeEnd("getPostTimer");
    res.status(200).json(posts);
  } catch (err) {
    console.log(`err getusercommentscounts`, err);
    res.status(400).json(err);
  }
}
