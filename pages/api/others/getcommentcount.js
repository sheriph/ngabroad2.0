import { get } from "lodash";
import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const { post_id } = req.body;
    const query = { "post._id": post_id };
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
    res.status(200).json(commentCount);
  } catch (err) {
    console.log(`err getcommentcount`, err);
    res.status(400).json(err);
  }
}
