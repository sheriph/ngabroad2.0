export const userSchema = {
  $jsonSchema: {
    title: "userSchema",
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
    },
  },
};

export const postSchema = {
  $jsonSchema: {
    title: "postSchema",
    required: ["content", "title", "createdAt", "user_id"],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      title: {
        bsonType: "string",
      },
      user_id: {
        bsonType: "objectId",
      },
      content: {
        bsonType: "string",
      },
      createdAt: {
        bsonType: "date",
      },
      slug: {
        bsonType: "string",
      },
      post_type: {
        bsonType: "string",
        enum: ["post", "question"],
        description: "Can only be post, question",
      },
      updatedAt: {
        bsonType: "date",
      },
      approves: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["comment", "status", "createdAt", "user_id"],
          properties: {
            user_id: {
              bsonType: "objectId",
            },
            createdAt: {
              bsonType: "date",
            },
            status: {
              bsonType: "bool",
            },
            comment: {
              bsonType: "string",
            },
          },
        },
      },
    },
  },
};

export const postCommentSchema = {
  $jsonSchema: {
    title: "postCommentSchema",
    required: [
      "content",
      "createdAt",
      "user_id",
      "post_id",
      "title",
      "post_type",
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      user_id: {
        bsonType: "objectId",
        description: "objectId of the Person making the comment",
      },
      post_id: {
        bsonType: "objectId",
        description: "ObjectId of the parent/original post",
      },
      title: {
        bsonType: "string",
        description: "Title of the original post",
      },
      quote: {
        bsonType: "object",
        description:
          "quoting a refernce post. The referenced post content and poster id is required",
        properties: {
          content: {
            bsonType: "string",
          },
          user_id: {
            bsonType: "objectId",
          },
        },
      },
      content: {
        bsonType: "string",
      },
      slug: {
        bsonType: "string",
      },
      createdAt: {
        bsonType: "date",
      },
      updatedAt: {
        bsonType: "date",
      },
      approves: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["comment", "status", "createdAt", "user_id"],
          properties: {
            user_id: {
              bsonType: "objectId",
            },
            createdAt: {
              bsonType: "date",
            },
            status: {
              bsonType: "bool",
            },
            comment: {
              bsonType: "string",
            },
          },
        },
      },
      post_type: {
        bsonType: "string",
        enum: ["comment"],
        description: "Can only be comment",
      },
    },
  },
};

//      stats: { votes: [], shares: [], views: [], comments: [], follows: [] },

export const votesSchema = {
  $jsonSchema: {
    title: "votesSchema",
    required: [
      "post_id",
      "title",
      "createdAt",
      "user_id",
      "slug",
      "post_type",
      "status",
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      title: {
        bsonType: "string",
      },
      post_id: {
        bsonType: "objectId",
      },
      createdAt: {
        bsonType: "date",
      },
      slug: {
        bsonType: "string",
      },

      user_id: {
        bsonType: "objectId",
      },
      updatedAt: {
        bsonType: "date",
      },
      status: {
        bsonType: "bool",
      },
      post_type: {
        bsonType: "string",
        enum: ["post", "question", "comment"],
        description: "Can only be post, question, or comment",
      },
    },
  },
};

export const followSchema = {
  $jsonSchema: {
    title: "followSchema",
    required: ["post_id", "title", "createdAt", "user_id", "slug", "post_type"],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      title: {
        bsonType: "string",
      },
      post_id: {
        bsonType: "objectId",
      },
      createdAt: {
        bsonType: "date",
      },
      slug: {
        bsonType: "string",
      },

      user_id: {
        bsonType: "objectId",
      },
      updatedAt: {
        bsonType: "date",
      },
      post_type: {
        bsonType: "string",
        enum: ["post", "question"],
        description: "Can only be post, question",
      },
    },
  },
};
