import { MongoClient, ObjectId } from "mongodb";
import { userSchema } from "../../lib/mongodb/schema";
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
    if (process.env.NODE_ENV !== "development") {
      await client.db("nga").command({
        collMod: "users",
        validator: userSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
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
    res.status(200).json(update.acknowledged);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
