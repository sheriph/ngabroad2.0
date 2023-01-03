import clientPromise from "../../../lib/mongodb/mongodbinstance";
const ObjectID = require("mongodb").ObjectId;

export default async function handler(req, res) {
  try {
    const { post_id, countries, otherTags, content, isComment } = req.body;
    const client = await clientPromise;
    const query = { _id: new ObjectID(post_id) };

    const operation = isComment
      ? {
          $set: {
            content: content,
          },
        }
      : {
          $set: {
            content: content,
            countries: countries,
            otherTags: otherTags,
          },
        };

    isComment
      ? await client
          .db("nga")
          .collection("postscomments")
          .updateOne(query, operation)
      : await client
          .db("nga")
          .collection("posts")
          .updateOne(query, operation);
    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  }
}
