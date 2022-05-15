import { MongoClient, ServerApiVersion } from "mongodb";
import { postSchema } from "../../lib/mongodb/schema";
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
  const required = [
    "content",
    "tags",
    "title",
    "commentsCount",
    "createdAt",
    "downvotesCount",
    "slug",
    "upvotesCount",
    "user_id",
    "viewsCount",
  ];

  try {
    const { user, title, tags, post } = req.body;
    const newPost = {
      approved: true,
      commentsCount: 0,
      content: post,
      createdAt: new Date(),
      downvotesCount: 0,
      slug: `${title.toLocaleLowerCase().replaceAll(" ", "-")}-${Math.floor(
        Math.random() * 100
      )}`,
      tags: tags,
      title: title.toLocaleLowerCase(),
      upvotesCount: 0,
      user_id: new ObjectID(user._id),
      viewsCount: 0,
    };

    await client.connect();
    if (process.env.NODE_ENV === "development") {
      console.log("adding validation");
      await client.db("ngabroad").command({
        collMod: "posts",
        validator: postSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    }

    const insert = await client
      .db("ngabroad")
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
