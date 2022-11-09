import { MongoClient, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function getPostComments(post_id) {
  try {
    // console.log("post_id", post_id);
    await client.connect();
    const query = { post_id: new ObjectId(post_id) };
    const options = {
      // sorting
      sort: { createdAt: -1 },
      //what to return
      projection: {},
    };
    const comments = await client
      .db("nga")
      .collection("postscomments")
      // @ts-ignore
      .find(query, options)
      .toArray();

    //  console.log(`log comments and closing connection`, comments);
    await client.close();

    return JSON.stringify(comments);
  } catch (error) {
    console.log(`error`, error.message, error.errInfo);
    return undefined;
  }
}
