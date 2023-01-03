import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { followSchema } from "../../../lib/mongodb/schema";
const ObjectID = require("mongodb").ObjectId;

export default async function handler(req, res) {
  try {
    const { user_id, post_id, post_title, slug, post_type, remove } = req.body;

    console.log(user_id, post_id, post_title, slug, post_type, remove);
    const client = await clientPromise;
    const query = {
      post_id: new ObjectID(post_id),
      user_id: new ObjectID(user_id),
    };

    const newFollow = {
      title: post_title,
      post_id: new ObjectID(post_id),
      createdAt: new Date(),
      slug: slug,
      user_id: new ObjectID(user_id),
      updatedAt: new Date(),
      post_type: post_type,
    };

    if (process.env.NODE_ENV !== "development") {
      await client.db("nga").command({
        collMod: "follows",
        validator: followSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    }

    remove
      ? await client
          .db("nga")
          .collection("follows")
          .findOneAndDelete(query)
      : await client
          .db("nga")
          .collection("follows")
          .updateOne(query, { $set: { ...newFollow } }, { upsert: true });
    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
