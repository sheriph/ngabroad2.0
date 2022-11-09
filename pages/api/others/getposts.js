import { get } from "lodash";
import { MongoClient, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);

    console.time("getPostTimer");

    const { key } = req.body;

    const [postType, page, limit] = key.split("-");
    console.log("postType", postType, page, limit);

    await client.connect();
    const query =
      Boolean(postType) && postType !== "all" ? { post_type: postType } : {};

    const options = {
      // sorting
      sort: { updatedAt: -1 },
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
    await client.close();
    res.status(200).json(posts);
  } catch (err) {
    console.log(`err getposts`, err);
    await client.close();
    res.status(400).json(err);
  }
}
