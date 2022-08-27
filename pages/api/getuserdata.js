import { MongoClient, ServerApiVersion } from "mongodb";
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
    const { email } = req.body;

    await client.connect();
    const filter = { email: email };

    const newUser = {
      createdAt: new Date(),
      lastSeen: new Date(),
      stats: {
        likes: 0,
        dislikes: 0,
        comments: 0,
        questions: 0,
        answers: 0,
        posts: 0,
      },
      email: email,
      role: "user",
    };

    if (process.env.NODE_ENV !== "development") {
      await client.db("nga").command({
        collMod: "users",
        validator: userSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    }

    const upsert = await client
      .db("nga")
      .collection("users")
      .updateOne(filter, { $setOnInsert: newUser }, { upsert: true });
    const userData = await client
      .db("nga")
      .collection("users")
      .findOne({ email: email });
    res.status(200).json(userData);
  } catch (error) {
    res.status(400).json(error.message);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
