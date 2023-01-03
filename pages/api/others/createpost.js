import { truncate } from "lodash";
import { MongoClient, ServerApiVersion } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { postSchema } from "../../../lib/mongodb/schema";
import { seoSlug } from "../../../lib/utility";
const ObjectID = require("mongodb").ObjectId;

export default async function handler(req, res) {
  try {
    const { user_id, title, content, post_type } = req.body;
    const slug = seoSlug(title);
    const client = await clientPromise;
    console.log("slug", slug);
    const newPost = {
      title: title,
      user_id: new ObjectID(user_id),
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
      approves: [],
      slug: truncate(slug, { length: 100, omission: "" }),
      post_type: post_type,
    };

    if (process.env.NODE_ENV === "development") {
      console.log("adding validation");
      await client.db("nga").command({
        collMod: "posts",
        validator: postSchema,
        validationLevel: "strict",
        validationAction: "error",
      });

      await client
        .db("nga")
        .collection("posts")
        .createIndex({ title: 1, slug: 1 }, { unique: true });
    }

    const insert = await client
      .db("nga")
      .collection("posts")
      .insertOne(newPost);
    res.status(200).json(truncate(slug, { length: 100, omission: "" }));
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
