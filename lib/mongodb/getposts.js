import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function getPosts() {
  try {
    await client.connect();
    const query = {};
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

    console.log(`log posts and closing connection`, posts);
    await client.close();

    return JSON.stringify(posts);
  } catch (err) {
    console.log(`err`, err);
    return undefined;
  }
}
