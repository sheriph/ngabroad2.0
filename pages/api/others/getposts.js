import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);

    const client = await clientPromise;

    const { offset, limit, text } = req.body;

    console.log("text", text);

    if (process.env.NODE_ENV === "development") {
      /*  await client.db("nga").collection("posts").dropIndexes();
      const index = await client
        .db("cl9ne")
        .collection("products")
        .listIndexes()
        .toArray();
      console.log("index", index); */
      await client.db("nga").collection("posts").createIndex({
        title: "text",
        content: "text",
        post_type: "text",
        city: "text",
      });
    }

    const query = text ? { $text: { $search: text } } : {};

    const options = {
      // sorting
      sort: { updatedAt: -1 },
      //what to return
      projection: {},
    };

    const sort = text
      ? {
          score: { $meta: "textScore" },
          lastCommentAt: -1,
          updatedAt: -1,
          createdAt: -1,
        }
      : { lastCommentAt: -1, updatedAt: -1, createdAt: -1 };

    const posts = await client
      .db("nga")
      .collection("posts")
      .find(query)
      .skip(offset)
      .limit(limit)
      // @ts-ignore
      .sort(sort)
      .toArray();

    res.status(200).json(posts);
  } catch (err) {
    console.log(`err getposts`, err);
    res.status(400).json(err);
  }
}
