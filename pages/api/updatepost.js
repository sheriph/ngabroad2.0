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
    const { post_id, countries, otherTags, content, isComment } = req.body;

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

    await client.connect();

    isComment
      ? await client
          .db("nga")
          .collection("postscomments")
          .updateOne(query, operation)
      : await client.db("nga").collection("posts").updateOne(query, operation);

    res.status(200).json(true);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message, info: error.errInfo });
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
