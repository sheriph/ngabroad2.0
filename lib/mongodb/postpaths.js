import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function getPostPaths() {
  try {
    await client.connect();
    const query = {};
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: { slug: 1, _id: 0 },
    };
    const slugs = await client
      .db("nga")
      .collection("posts")
      .find(query, options)
      .toArray();

    console.log(`log slugs and close connections`, slugs);
    await client.close();
    return slugs;
  } catch (error) {
    console.log("error", error.message, error.errInfo);
    await client.close();
    return undefined;
  }
}
