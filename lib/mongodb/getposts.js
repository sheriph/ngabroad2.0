import { flatten, uniq } from "lodash";
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
      projection: { content: 0, updatedAts: 0, approves: 0 },
    };
    const posts = await client
      .db("nga")
      .collection("posts")
      .find(query, options)
      .toArray();

    const countries = uniq(flatten(posts.map((doc) => doc.tags.countries)));
    const otherTags = uniq(flatten(posts.map((doc) => doc.tags.otherTags)));
    const ssrTags = { countries, otherTags };

    const post_type = ["post", "question"];

    const allTags = [
      "post_type",
      ...post_type,
      "tags",
      ...ssrTags.otherTags,
      "countries",
      ...ssrTags.countries,
    ];

    const sidebarFilter = [
      ...allTags.map((tag) => ({ name: tag, check: false })),
    ];

    console.log(`log posts and closing connection`, posts);
    await client.close();

    return JSON.stringify({ posts, sidebarFilter });
  } catch (err) {
    console.log(`err`, err);
    await client.close();
    return undefined;
  }
}
