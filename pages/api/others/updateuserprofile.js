import { MongoClient, ObjectId } from "mongodb";
import { userSchema } from "../../../lib/mongodb/schema";
import { forIn, get, trim } from "lodash";
const uri = process.env.MONGODB_URI;
const clientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
// @ts-ignore
const client = new MongoClient(uri, clientOptions);

export default async function handler(req, res) {
  try {
    await client.connect();
    if (process.env.NODE_ENV === "development") {
      await client.db("nga").command({
        collMod: "users",
        validator: userSchema,
        validationLevel: "strict",
        validationAction: "error",
      });

      await client
        .db("nga")
        .collection("users")
        .createIndex({ username: 1 }, { unique: true });
    }

    const { data, _id } = req.body;
    console.log("data", data);
    const queryOperation = { _id: new ObjectId(_id) };
    const updateOperation = {
      $set: { ...data },
    };
    await client.connect();
    const update = await client
      .db("nga")
      .collection("users")
      .updateOne(queryOperation, updateOperation);
    console.log("update", update);
    await client.close();
    res.status(200).json(update.acknowledged);
  } catch (error) {
    console.log(`err`, error.message);
    await client.close();
    res.status(400).json(error.message);
  }
}
