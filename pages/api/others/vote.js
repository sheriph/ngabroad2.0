import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { postSchema, votesSchema } from "../../../lib/mongodb/schema";
import { seoSlug } from "../../../lib/utility";
const ObjectID = require("mongodb").ObjectId;

export default async function handler(req, res) {
  try {
    const { user_id, post_id, voteType } = req.body;
    console.log("user_id, post_id, voteType", user_id, post_id, voteType);
    const client = await clientPromise;
    if (process.env.NODE_ENV !== "development") {
      await client.db("nga").command({
        collMod: "votes",
        validator: votesSchema,
        validationLevel: "strict",
        validationAction: "error",
      });

      /* await client
        .db("nga")
        .collection("votes")
        .createIndex({ user_id: 1, voteType: 1 }, { unique: true }); */
    }

    // vote now

    const query = {
      post_id: new ObjectID(post_id),
      user_id: new ObjectID(user_id),
    };

    const newVote = {
      post_id: new ObjectID(post_id),
      user_id: new ObjectID(user_id),
      voteType,
    };

    await client
      .db("nga")
      .collection("votes")
      .findOneAndReplace(query, newVote, { upsert: true });

    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
