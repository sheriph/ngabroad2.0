import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";
import { userSchema } from "../../../lib/mongodb/schema";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
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
    const update = await client
      .db("nga")
      .collection("users")
      .updateOne(queryOperation, updateOperation);
    console.log("update", update);
    res.status(200).json(update.acknowledged);
  } catch (error) {
    console.log(`err`, error.message);
    res.status(400).json(error.message);
  }
}
