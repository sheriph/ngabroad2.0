import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);

    console.time("getPostTimer");
    const client = await clientPromise;
    const { key } = req.body;

    const [page, limit, id] = key.split("-");
    console.log("postType", page, limit, id);

    const query = { user_id: new ObjectId(id) };

    const options = {
      // sorting
      sort: { createdAt: -1 },
      //what to return
      projection: {},
    };
    const posts = await client
      .db("nga")
      .collection("postscomments")
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
    console.log(`err getusercomments`, err);
    res.status(400).json(err);
  }
}
