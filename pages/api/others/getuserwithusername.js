import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  const { username } = req.body;
  console.log("username", username);
  const userFilter = { username: username };

  try {
    const client = await clientPromise;
    const user = await client
      .db("nga")
      .collection("users")
      .findOne(userFilter);
    res.status(200).json(user);
  } catch (error) {
    console.log(`err`, error.message);
    res.status(400).json(error.message);
  }
}
