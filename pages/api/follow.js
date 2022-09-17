import { MongoClient, ServerApiVersion } from "mongodb";
import {
  followSchema,
  postSchema,
  votesSchema,
} from "../../lib/mongodb/schema";
import { seoSlug } from "../../lib/utility";
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
    const { user_id, post_id, post_title, slug, post_type, remove } = req.body;

    console.log(user_id, post_id, post_title, slug, post_type, remove);

    await client.connect();

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
      ? await client.db("nga").collection("follows").findOneAndDelete(query)
      : await client
          .db("nga")
          .collection("follows")
          .updateOne(query, { $set: { ...newFollow } }, { upsert: true });

    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
