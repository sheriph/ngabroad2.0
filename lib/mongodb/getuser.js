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

export default async function getUser(authUser, username) {
  const email = get(authUser, "attributes.email");

  const filter = email
    ? { email: email, username: username }
    : { username: username };

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

  try {
    await client.connect();

    if (process.env.NODE_ENV !== "development") {
      await client.db("nga").command({
        collMod: "users",
        validator: userSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    }

    await client
      .db("nga")
      .collection("users")
      .updateOne(filter, { $setOnInsert: newUser }, { upsert: true });

    const userData = await client.db("nga").collection("users").findOne(filter);
    console.log(`log userData and closing connection`, userData);
    await client.close();
    return JSON.stringify(userData);
  } catch (error) {
    console.log(`err`, error);
    return undefined;
  }
}
