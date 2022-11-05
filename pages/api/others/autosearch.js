import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function handler(req, res) {
  try {
    const { text } = req.body;
    console.log(`req.body`, text);

    await client.connect();

    // sort returned documents by descending text relevance score
    const sort = { score: { $meta: "textScore" } };
    // Include only the `title` and `score` fields in each returned document
    const projection = {
      _id: 0,
      title: 1,
      score: { $meta: "textScore" },
      content: 1,
      slug: 1,
    };

    const response = await client
      .db("nga")
      .collection("posts")
      .find({ $text: { $search: text } })
      .sort(sort)
      .project(projection);
    const resToArray = await response.toArray();
    console.log("response", resToArray);
    await client.close();
    res.status(200).json(resToArray);
  } catch (err) {
    console.log(`err`, err);
    await client.close();
    res.status(400).json(err);
  }
}
