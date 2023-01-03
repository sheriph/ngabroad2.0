import { MongoClient, ServerApiVersion } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { postCommentSchema, postSchema } from "../../../lib/mongodb/schema";
const ObjectID = require("mongodb").ObjectId;

export default async function handler(req, res) {
  try {
    const {
      content,
      user_id,
      post_id,
      title,
      quotedPostContent,
      quotedUser_id,
      slug,
    } = req.body;
    const client = await clientPromise;
    const newComment = {
      content: content,
      user_id: new ObjectID(user_id),
      post_id: new ObjectID(post_id),
      quote: {
        content: quotedPostContent,
        user_id: new ObjectID(quotedUser_id),
      },
      createdAt: new Date(),
      title: title,
      updatedAt: new Date(),
      approves: [],
      post_type: "comment",
      slug: slug,
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

    await client
      .db("nga")
      .collection("postscomments")
      .insertOne(newComment);
    const query = { _id: new ObjectID(post_id) };
    const operation = { $set: { updatedAt: new Date() } };
    await client
      .db("nga")
      .collection("posts")
      .updateOne(query, operation);
    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
