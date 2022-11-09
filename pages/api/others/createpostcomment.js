import { MongoClient, ServerApiVersion } from "mongodb";
import { postCommentSchema, postSchema } from "../../../lib/mongodb/schema";
const ObjectID = require("mongodb").ObjectId;
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  serverApi: ServerApiVersion.v1,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

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
    const newPost = {
      content: content,
      user_id: new ObjectID(user_id),
      post_id: new ObjectID(post_id),
      quote: {
        content: quotedPostContent,
        user_id: new ObjectID(quotedUser_id),
      },
      createdAt: new Date(),
      title: title,
      updatedAts: [],
      approves: [],
      post_type: "comment",
      slug: slug,
    };

    await client.connect();
    if (process.env.NODE_ENV === "development") {
      console.log("adding validation");
      await client.db("nga").command({
        collMod: "postscomments",
        validator: postCommentSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    }

    const insert = await client
      .db("nga")
      .collection("postscomments")
      .insertOne(newPost);
    await client.close();
    res.status(200).json(insert.acknowledged);
  } catch (error) {
    console.log("error", error);
    await client.close();
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}