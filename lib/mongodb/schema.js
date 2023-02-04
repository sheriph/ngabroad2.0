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
    type: "object",
    required: ["title", "content", "slug", "user_id", "createdAt"],
    properties: {
      title: {
        bsonType: "string",
        description:
          "Title of the post, should be a descriptive and concise string.",
      },
      content: {
        bsonType: "string",
        description:
          "The main content of the post, can contain HTML and other rich media.",
      },
      slug: {
        bsonType: "string",
        description:
          "A URL-friendly string that represents the post, used for linking to the post's details page.",
      },
      tags: {
        bsonType: "array",
        items: {
          bsonType: "string",
        },
        description:
          "An array of tags that describe the post, used for filtering and searching.",
      },
      user_id: {
        bsonType: "objectId",
        description:
          "The ID of the user who created the post, used to identify the author.",
      },
      createdAt: {
        bsonType: "date",
        description:
          "The date and time that the post was created, used for ordering and searching.",
      },
      updatedAt: {
        bsonType: "date",
        description:
          "The date and time that the post was last updated, used for tracking post revisions.",
      },
      views: {
        bsonType: "int",
        description:
          "The number of views that the post has received, used to display popular posts.",
      },
      prowrite: {
        bsonType: "bool",
        description: "The type of editor used",
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
