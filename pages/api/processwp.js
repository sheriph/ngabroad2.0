import { truncate } from "lodash";
import { MongoClient, ServerApiVersion } from "mongodb";
import { getAllPostsWithSlug } from "../../components/wp";
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
    const posts = await getAllPostsWithSlug();

    for (let post of posts.edges) {
      const { slug, title, content, date } = post.node;
      const user_id = "62fd5507d0b451b394f7dc3a";
      const countries = [];
      const otherTags = [];
      const post_type = "post";
      const newPost = {
        title: title,
        user_id: new ObjectID(user_id),
        content: content,
        createdAt: new Date(date),
        updatedAts: [],
        approves: [],
        slug: slug,
        tags: { otherTags: [...otherTags], countries: [...countries] },
        post_type: post_type,
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
    }

    /*  const { user_id, title, countries, otherTags, content, post_type } =
      req.body;
    const slug = seoSlug(title);
    console.log("slug", slug);
    const newPost = {
      title: title,
      user_id: new ObjectID(user_id),
      content: content,
      createdAt: new Date(),
      updatedAts: [],
      approves: [],
      slug: truncate(slug, { length: 100, omission: "" }),
      tags: { otherTags: [...otherTags], countries: [...countries] },
      post_type: post_type,
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
      .insertOne(newPost); */

    res.status(200).json(posts);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
