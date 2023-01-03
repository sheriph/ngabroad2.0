import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { postSchema, votesSchema } from "../../../lib/mongodb/schema";
import { seoSlug } from "../../../lib/utility";
const ObjectID = require("mongodb").ObjectId;

export default async function handler(req, res) {
  try {
    const { user_id, status, post_id, post_title, slug, post_type, remove } =
      req.body;
      const client = await clientPromise;
    const query = {
      post_id: new ObjectID(post_id),
      user_id: new ObjectID(user_id),
    };

    const newVote = {
      title: post_title,
      post_id: new ObjectID(post_id),
      createdAt: new Date(),
      slug: slug,
      user_id: new ObjectID(user_id),
      updatedAt: new Date(),
      status: status,
      post_type: post_type,
    };

    if (process.env.NODE_ENV !== "development") {
      await client.db("nga").command({
        collMod: "votes",
        validator: votesSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    }

    remove
      ? await client
          .db("nga")
          .collection("votes")
          .findOneAndDelete(query)
      : await client
          .db("nga")
          .collection("votes")
          .updateOne(query, { $set: { ...newVote } }, { upsert: true });
    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
