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
    // console.log(`req.body`, req.body);

    await client.connect();
    const query = {};
    const options = {
      // sorting
      sort: {},
      //what to return
      projection: { username: 1, _id: 0 },
    };
    const response = await client
      .db("nga")
      .collection("users")
      .find(query, options)
      .toArray();
    const usernames = response
      .map((username) => get(username, "username", ""))
      .filter((username) => username);
    console.log("usernames", usernames);

    res.status(200).json(usernames);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
