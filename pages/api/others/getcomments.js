import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);

    const client = await clientPromise;

    const { offset, limit, text, user_id } = req.body;

    console.log("text", text);

    if (process.env.NODE_ENV === "development") {
      await client.db("nga").collection("postscomments").createIndex({
        content: "text",
      });
    }

    const query = text
      ? { $text: { $search: text }, user_id: new ObjectId(user_id) }
      : { user_id: new ObjectId(user_id) };

    const sort = text
      ? {
          score: { $meta: "textScore" },
          updatedAt: -1,
          createdAt: -1,
        }
      : { updatedAt: -1, createdAt: -1 };

    const comments = await client
      .db("nga")
      .collection("postscomments")
      .find(query)
      .skip(offset)
      .limit(limit)
      // @ts-ignore
      .sort(sort)
      .toArray();

    res.status(200).json(comments);
  } catch (err) {
    console.log(`err getposts`, err);
    res.status(400).json(err);
  }
}
