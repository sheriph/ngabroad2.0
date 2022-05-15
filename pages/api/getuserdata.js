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
    console.log(`req.body`, req.body);
    const { email } = req.body;

    await client.connect();
    const filter = { "contact.email": email };

    const newUser = {
      createdAt: new Date(),
      lastSeen: new Date(),
      stats: {
        upvotesCount: 0,
        postsCount: 0,
        commentsCount: 0,
        downvotesCount: 0,
      },
      dateModified: new Date("1900"),
      contact: {
        state: "",
        country: "",
        email: email,
        phone: "",
        twitter: "",
        facebook: "",
        instagram: "",
      },
      profile: {
        fistName: "",
        lastName: "",
        avatar: "",
        role: "",
        nickname: "",
        gender: "",
        about: "",
        profileType: "",
      },
      specialty: "",
      job: {
        field: "",
        employer: "",
      },
    };

    if (process.env.NODE_ENV !== "development") {
      await client.db("ngabroad").command({
        collMod: "users",
        validator: userSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    }

    const upsert = await client
      .db("ngabroad")
      .collection("users")
      .updateOne(filter, { $setOnInsert: newUser }, { upsert: true });
    const userData = await client
      .db("ngabroad")
      .collection("users")
      .findOne({ "contact.email": email });
    console.log(
      "User Created successfully",
      upsert.matchedCount,
      upsert.upsertedCount
    );
    res.status(200).json(userData);
  } catch (error) {
    res.status(400).json(error.message);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
