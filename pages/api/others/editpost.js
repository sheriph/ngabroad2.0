import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { postSchema } from "../../../lib/mongodb/schema";
const ObjectID = require("mongodb").ObjectId;

const slugify = require("slugify");

export default async function handler(req, res) {
  try {
    const { content, tags, prowrite, prevPost } = req.body;
    const client = await clientPromise;

    console.log(prevPost._id);

    if (process.env.NODE_ENV === "development") {
      console.log("adding validation");
      await client.db("nga").command({
        collMod: "posts",
        validator: postSchema,
        // validationLevel: "",
        validationAction: "error",
      });
    }

    const newPost = {
      content: content,
      tags: tags,
      // @ts-ignore
      prowrite,
      updatedAt: new Date(),
    };

    const postsCollection = await client
      .db("nga")
      .collection("posts")
      .updateOne(
        { _id: new ObjectID(prevPost._id) },
        {
          $set: {
            content: content,
            tags: tags,
            // @ts-ignore
            prowrite,
            updatedAt: new Date(),
          },
        }
      );

    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
