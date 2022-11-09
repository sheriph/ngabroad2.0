import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function getPost(slug) {
  try {
   // console.log("slug", slug);
    await client.connect();
    const query = { slug: slug };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: {},
    };
    const post = await client
      .db("nga")
      .collection("posts")
      .findOne(query, options);

   // console.log(`log post and closing connection`, post);
    await client.close();

    return JSON.stringify(post);
  } catch (err) {
    console.log(`err`, err);
    return undefined;
  }
}
