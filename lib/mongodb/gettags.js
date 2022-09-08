import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function getTags() {
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

    await client.close();

    return JSON.stringify(tags);
  } catch (err) {
    console.log(`err`, err);
    return undefined;
  }
}
