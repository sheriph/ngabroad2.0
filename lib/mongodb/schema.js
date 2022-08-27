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
          follows: {
            bsonType: "int",
          },
          views: {
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
      updatedAts: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["createdAt", "user_id"],
          properties: {
            user_id: {
              bsonType: "objectId",
            },
            createdAt: {
              bsonType: "date",
            },
          },
        },
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
      stats: {
        bsonType: "object",
        properties: {
          votes: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["user_id", "createdAt", "status", "updatedAt"],
              properties: {
                user_id: {
                  bsonType: "objectId",
                },
                createdAt: {
                  bsonType: "date",
                },
                updatedAt: {
                  bsonType: "date",
                },
                status: {
                  bsonType: "bool",
                },
              },
            },
          },
          shares: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["user_id", "createdAt"],
              properties: {
                user_id: {
                  bsonType: "objectId",
                },
                createdAt: {
                  bsonType: "date",
                },
              },
            },
          },
          views: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["user_id", "createdAt"],
              properties: {
                user_id: {
                  bsonType: "objectId",
                },
                createdAt: {
                  bsonType: "date",
                },
              },
            },
          },
          follows: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["user_id", "createdAt", "status", "updatedAt"],
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
                updatedAt: {
                  bsonType: "date",
                },
              },
            },
          },
          comments: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["user_id", "createdAt", "comment_id"],
              properties: {
                user_id: {
                  bsonType: "objectId",
                },
                comment_id: {
                  bsonType: "objectId",
                },
                createdAt: {
                  bsonType: "date",
                },
              },
            },
          },
        },
      },
      tags: {
        bsonType: "object",
        properties: {
          otherTags: {
            bsonType: "array",
            items: {
              bsonType: "string",
            },
          },
          countries: {
            bsonType: "array",
            items: {
              bsonType: "string",
            },
          },
        },
      },
    },
  },
};
