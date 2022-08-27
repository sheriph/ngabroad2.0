import { MongoClient, ServerApiVersion } from "mongodb";
import { postSchema } from "../../lib/mongodb/schema";
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
    const { user_id, title, countries, otherTags, content } = req.body;
    const slug = seoSlug(title);
    console.log("slug", slug);
    const newPost = {
      title: title,
      user_id: new ObjectID(user_id),
      content: content,
      createdAt: new Date(),
      updatedAts: [],
      approves: [],
      slug: slug,
      stats: { votes: [], shares: [], views: [], comments: [], follows: [] },
      tags: { otherTags: [...otherTags], countries: [...countries] },
    };

    await client.connect();
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

    res.status(200).json(insert.acknowledged);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
