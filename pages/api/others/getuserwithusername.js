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
  const { username } = req.body;
  console.log("username", username);
  const userFilter = { username: username };

  try {
    await client.connect();
    const user = await client.db("nga").collection("users").findOne(userFilter);
    await client.close();
    res.status(200).json(user);
  } catch (error) {
    console.log(`err`, error.message);
    await client.close();
    res.status(400).json(error.message);
  }
}
