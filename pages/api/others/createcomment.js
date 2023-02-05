import { MongoClient, ServerApiVersion } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { postCommentSchema, postSchema } from "../../../lib/mongodb/schema";
const ObjectID = require("mongodb").ObjectId;

export default async function handler(req, res) {
  try {
    const { user_id, content, prowrite, post, replyPost } = req.body;
    const client = await clientPromise;
    const newComment = {
      content: content,
      user_id: new ObjectID(user_id),
      post,
      replyPost,
      createdAt: new Date(),
      updatedAt: new Date(),
      prowrite,
    };
    if (process.env.NODE_ENV === "development") {
      console.log("adding validation");
      await client.db("nga").command({
        collMod: "postscomments",
        validator: postCommentSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    }

    await client.db("nga").collection("postscomments").insertOne(newComment);
    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
