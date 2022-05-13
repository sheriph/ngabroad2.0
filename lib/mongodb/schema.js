export const userSchema = {
  $jsonSchema: {
    title: "user",
    properties: {
      _id: {
        bsonType: "objectId",
      },
      contact: {
        bsonType: "object",
        properties: {
          country: {
            bsonType: "string",
          },
          email: {
            bsonType: "string",
          },
          facebook: {
            bsonType: "string",
          },
          instagram: {
            bsonType: "string",
          },
          phone: {
            bsonType: "string",
          },
          state: {
            bsonType: "string",
          },
          twitter: {
            bsonType: "string",
          },
        },
      },
      createdAt: {
        bsonType: "date",
      },
      dateModified: {
        bsonType: "date",
      },
      job: {
        bsonType: "object",
        properties: {
          employer: {
            bsonType: "string",
          },
          field: {
            bsonType: "string",
          },
        },
      },
      lastSeen: {
        bsonType: "date",
      },
      profile: {
        bsonType: "object",
        properties: {
          about: {
            bsonType: "string",
          },
          avatar: {
            bsonType: "string",
          },
          fistName: {
            bsonType: "string",
          },
          gender: {
            bsonType: "string",
          },
          lastName: {
            bsonType: "string",
          },
          nickname: {
            bsonType: "string",
          },
          profileType: {
            bsonType: "string",
          },
          role: {
            bsonType: "string",
          },
        },
      },
      specialty: {
        bsonType: "string",
      },
      stats: {
        bsonType: "object",
        properties: {
          commentsCount: {
            bsonType: "int",
          },
          downvotesCount: {
            bsonType: "int",
          },
          postsCount: {
            bsonType: "int",
          },
          upvotesCount: {
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
    properties: {
      _id: {
        bsonType: "objectId",
      },
      approved: {
        bsonType: "bool",
      },
      category: {
        bsonType: "string",
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
