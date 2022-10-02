import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { userSchema } from "../../lib/mongodb/schema";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  serverApi: ServerApiVersion.v1,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function handler(req, res) {
  try {
    const { user_id } = req.body;
    console.log("_id", user_id);
    const query = { _id: new ObjectId(user_id) };

    const projection = { username: 1, _id: 0 };
    await client.connect();
    const userData = await client.db("nga").collection("users").findOne(query);
    // @ts-ignore
    console.log("userData", userData);
    await client.close();
    // @ts-ignore
    res.status(200).json(userData?.username);
  } catch (error) {
    console.log("error.message", error.message);
    await client.close();
    res.status(400).json(error.message);
  }
}
