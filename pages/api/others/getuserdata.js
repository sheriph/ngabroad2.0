import { withSSRContext } from "aws-amplify";
import { get } from "lodash";
import { MongoClient, ServerApiVersion } from "mongodb";
import { userSchema } from "../../../lib/mongodb/schema";
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
    await client.connect();
    const { Auth } = withSSRContext({ req });
    const authUser = await Auth.currentAuthenticatedUser();
    const email = get(authUser, "attributes.email");
    console.log("email", email);
    const filter = { email: email };

    const newUser = {
      createdAt: new Date(),
      lastSeen: new Date(),
      email: email,
      role: "user",
    };

    if (process.env.NODE_ENV === "development") {
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
    const userData = await client
      .db("nga")
      .collection("users")
      .findOne({ email: email });
    await client.close();
    res.status(200).json(userData);
  } catch (error) {
    await client.close();
    console.log("error.response", error.response);
    res.status(400).json(error.response);
  }
}
