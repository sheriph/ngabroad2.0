import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { postSchema } from "../../../lib/mongodb/schema";
const ObjectID = require("mongodb").ObjectId;


export default async function handler(req, res) {
  try {
    const { content, prowrite, prevComment } = req.body;
    const client = await clientPromise;

    console.log(prevComment._id);

    if (process.env.NODE_ENV === "development") {
      console.log("adding validation");
      await client.db("nga").command({
        collMod: "posts",
        validator: postSchema,
        // validationLevel: "",
        validationAction: "error",
      });
    }

    await client
      .db("nga")
      .collection("postscomments")
      .updateOne(
        { _id: new ObjectID(prevComment._id) },
        {
          $set: {
            content: content,
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
