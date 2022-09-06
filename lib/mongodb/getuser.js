import { get } from "lodash";
import { MongoClient } from "mongodb";
import { userSchema } from "./schema";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function getUser(username) {
  const userFilter = { username: username };

  try {
    await client.connect();

    const user = await client.db("nga").collection("users").findOne(userFilter);
    await client.close();
    return JSON.stringify(user);
  } catch (error) {
    console.log(`err`, error);
    return undefined;
  }
}
