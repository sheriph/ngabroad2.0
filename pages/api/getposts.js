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

    const { post_type, countries, otherTags } = req.body;
    console.log(
      "post_type, countries, otherTags",
      post_type,
      countries,
      otherTags
    );
    await client.connect();
    const query = {};
    console.log("query", query);
    post_type.length > 0 ? (query["post_type"] = { $in: [...post_type] }) : "";
    post_type.otherTags > 0
      ? (query["tags.otherTags"] = { $in: [...otherTags] })
      : "";
    post_type.countries > 0
      ? (query["tags.countries"] = { $in: [...countries] })
      : "";
    /* const query = {
      post_type: { $in: [...post_type] },
      "tags.otherTags": { $in: [...otherTags] },
      "tags.countries": { $in: [...countries] },
    }; */
    console.log("query 2", query);
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: {},
    };
    const posts = await client
      .db("nga")
      .collection("posts")
      .find(query, options)
      .toArray();
    // console.log("posts", posts);
    res.status(200).json(posts);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  } finally {
    console.log(`closing connection`);
    setTimeout(async () => {
      await client.close();
    }, 1500);
  }
}
