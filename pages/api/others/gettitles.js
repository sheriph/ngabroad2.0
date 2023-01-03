import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    const { title } = req.body;
    console.log(`req.body`, title);
    const client = await clientPromise;
    const query = { title: title };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: { _id: 1, title: 1, slug: 1 },
    };
    const response = await client
      .db("nga")
      .collection("posts")
      .findOne(query, options);

    console.log("response", response);
    res.status(200).json(response);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  }
}
