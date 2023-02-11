import { get } from "lodash";
import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb/mongodbinstance";

export default async function handler(req, res) {
  try {
    // console.log(`req.body`, req.body);
    const client = await clientPromise;
    const { user_id } = req.body;

    const posts = await client
      .db("nga")
      .collection("posts")
      .aggregate([
        {
          $match: { user_id: new ObjectId(user_id) },
        },
        {
          $lookup: {
            from: "votes",
            let: { post_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$post_id", "$$post_id"] },
                      { $eq: ["$voteType", "upvote"] },
                    ],
                  },
                },
              },
            ],
            as: "upvotes",
          },
        },
      ])
      .toArray();

    const comments = await client
      .db("nga")
      .collection("postscomments")
      .aggregate([
        {
          $match: { user_id: new ObjectId(user_id) },
        },
        {
          $lookup: {
            from: "votes",
            let: { post_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$post_id", "$$post_id"] },
                      { $eq: ["$voteType", "upvote"] },
                    ],
                  },
                },
              },
            ],
            as: "upvotes",
          },
        },
      ])
      .toArray();

    const allUpvotes = [...posts, ...comments].reduce(
      (acc, item) => acc + item.upvotes.length,
      0
    );

    console.log("allUpvotes", allUpvotes);

    res.status(200).json(allUpvotes);
  } catch (err) {
    console.log(`err`, err);
    res.status(400).json(err);
  }
}
