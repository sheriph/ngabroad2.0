export const userSchema = {
  $jsonSchema: {
    title: "user",
    required: ["email", "role"],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      email: {
        bsonType: "string",
      },
      phone: {
        bsonType: "string",
      },
      createdAt: {
        bsonType: "date",
      },
      lastSeen: {
        bsonType: "date",
      },
      image: {
        bsonType: "string",
      },
      fistName: {
        bsonType: "string",
      },
      gender: {
        bsonType: "string",
        enum: ["Male", "Female"],
        description: "can only Male or Female",
      },
      role: {
        bsonType: "string",
        enum: ["user", "moderator", "admin"],
        description: "Can only be user, moderator, or admin",
      },
      lastName: {
        bsonType: "string",
      },
      username: {
        bsonType: "string",
      },
      stats: {
        bsonType: "object",
        properties: {
          likes: {
            bsonType: "int",
          },
          dislikes: {
            bsonType: "int",
          },
          posts: {
            bsonType: "int",
          },
          comments: {
            bsonType: "int",
          },
          questions: {
            bsonType: "int",
          },
          answers: {
            bsonType: "int",
          },
        },
      },
    },
  },
};

export const commentSchema = {
  $jsonSchema: {
    title: "comment",
    properties: {
      _id: {
        bsonType: "objectId",
      },
      approved: {
        bsonType: "bool",
      },
      content: {
        bsonType: "string",
      },
      createdAt: {
        bsonType: "date",
      },
      dateModified: {
        bsonType: "date",
      },
      downvotesCount: {
        bsonType: "int",
      },
      post_id: {
        bsonType: "objectId",
      },
      upvotesCount: {
        bsonType: "int",
      },
      user_id: {
        bsonType: "objectId",
      },
    },
  },
};

export const downvoteSchema = {
  $jsonSchema: {
    title: "downvote",
    properties: {
      _id: {
        bsonType: "objectId",
      },
      comment_id: {
        bsonType: "objectId",
      },
      createdAt: {
        bsonType: "date",
      },
      post_id: {
        bsonType: "objectId",
      },
      user_id: {
        bsonType: "objectId",
      },
    },
  },
};

export const upvoteSchema = {
  $jsonSchema: {
    title: "upvote",
    properties: {
      _id: {
        bsonType: "objectId",
      },
      comment_id: {
        bsonType: "objectId",
      },
      createdAt: {
        bsonType: "date",
      },
      post_id: {
        bsonType: "objectId",
      },
      user_id: {
        bsonType: "objectId",
      },
    },
  },
};

export const postSchema = {
  $jsonSchema: {
    title: "post",
    required: [
      "content",
      "tags",
      "title",
      "commentsCount",
      "createdAt",
      "downvotesCount",
      "slug",
      "upvotesCount",
      "user_id",
      "viewsCount",
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      approved: {
        bsonType: "bool",
      },
      commentsCount: {
        bsonType: "int",
      },
      content: {
        bsonType: "string",
      },
      createdAt: {
        bsonType: "date",
      },
      dateModified: {
        bsonType: "date",
      },
      downvotesCount: {
        bsonType: "int",
      },
      slug: {
        bsonType: "string",
      },
      tags: {
        bsonType: "array",
        items: {
          bsonType: "string",
        },
      },
      title: {
        bsonType: "string",
      },
      upvotesCount: {
        bsonType: "int",
      },
      user_id: {
        bsonType: "objectId",
      },
      viewsCount: {
        bsonType: "int",
      },
    },
  },
};
