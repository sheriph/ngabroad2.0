import { flatten, uniq } from "lodash";
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
    await client.connect();
    const query = {};
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: { tags: 1 },
    };
    const tags = await client
      .db("nga")
      .collection("posts")
      .find(query, options)
      .toArray();

    const countries = uniq(flatten(tags.map((doc) => doc.tags.countries)));
    const otherTags = uniq(flatten(tags.map((doc) => doc.tags.otherTags)));
    const ssrTags = { countries, otherTags };

    res.status(200).json(ssrTags);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
