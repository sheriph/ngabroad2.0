import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    const { user_id } = req.body;
    console.log("_id", user_id);
    const query = { _id: new ObjectId(user_id) };
    const client = await clientPromise;
    const projection = { username: 1, _id: 0 };
    const userData = await client
      .db("nga")
      .collection("users")
      .findOne(query);
    // @ts-ignore
    console.log("userData", userData);
    // @ts-ignore
    res.status(200).json(userData?.username);
  } catch (error) {
    console.log("error.message getusername", error.message);
    res.status(400).json(error.message);
  }
}
