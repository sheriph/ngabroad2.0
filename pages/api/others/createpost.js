import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { postSchema } from "../../../lib/mongodb/schema";
const ObjectID = require("mongodb").ObjectId;

const slugify = require("slugify");
const slugifyOptions = {
  replacement: "-", // replace spaces with replacement character, defaults to `-`
  remove: undefined, // remove characters that match regex, defaults to `undefined`
  lower: true, // convert to lower case, defaults to `false`
  strict: true, // strip special characters except replacement, defaults to `false`
  locale: "vi", // language code of the locale to use
  trim: true, // trim leading and trailing replacement chars, defaults to `true`
};

export default async function handler(req, res) {
  try {
    const { user_id, title, content, tags, prowrite } = req.body;
    const client = await clientPromise;

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

    const newPost = {
      title: title,
      user_id: new ObjectID(user_id),
      content: content,
      createdAt: new Date(),
      tags: tags,
      // @ts-ignore
      slug: slugify(title, slugifyOptions),
      prowrite,
      upvotes: 0,
      downvotes: 0,
      updatedAt: new Date(),
      lastCommentAt: new Date(),
    };

    await client.db("nga").collection("posts").insertOne(newPost);
    // @ts-ignore
    res.status(200).json(slugify(title));
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
