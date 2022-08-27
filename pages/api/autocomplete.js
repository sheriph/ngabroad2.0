import { get } from "lodash";
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
    const { title } = req.body;
    console.log(`req.body`, title);

    await client.connect();
    const agg = [
      {
        $search: {
          index: "auto_complete_index",
          text: {
            query: title,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      { $limit: 10 },
      { $project: { _id: 0, title: 1 } },
    ];
    /*  const query = { title: title };
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: { _id: 1 },
    }; */
    const response = await client.db("nga").collection("posts").aggregate(agg);
    const resToArray = await response.toArray();
    console.log("response", resToArray);

    res.status(200).json(resToArray);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
