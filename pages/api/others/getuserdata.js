import { withSSRContext } from "aws-amplify";
import { get } from "lodash";
import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { userSchema } from "../../../lib/mongodb/schema";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const { Auth } = withSSRContext({ req });
    const authUser = await Auth.currentAuthenticatedUser();
    const email = get(authUser, "attributes.email");
    console.log("email", email);
    const filter = { email: email };

    const newUser = {
      createdAt: new Date(),
      lastSeen: new Date(),
      email: email,
      role: "member",
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
    res.status(200).json(userData);
  } catch (error) {
    console.log("error.response", error.response);
    res.status(400).json(error.response);
  }
}
