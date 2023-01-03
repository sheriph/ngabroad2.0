import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);
    const client = await clientPromise;
    console.time("getPostTimer");

    const { key } = req.body;

    const [postType, page, limit, id] = key.split("-");
    console.log("postType", postType, page, limit, id);

    const query = { post_type: postType, user_id: new ObjectId(id) };

    const options = {
      // sorting
      sort: { createdAt: -1 },
      //what to return
      projection: {},
    };
    const posts = await client
      .db("nga")
      .collection("posts")
      // @ts-ignore
      .find(query, options)
      .limit(Number(limit))
      .skip(Number(page) * Number(limit))
      // .limit(index ? index * 5 : 5)
      .toArray();
    // console.log("posts", posts);
    console.timeEnd("getPostTimer");
    res.status(200).json(posts);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  }
}
