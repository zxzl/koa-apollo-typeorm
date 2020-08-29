const { gql } = require("apollo-server-koa");

export const typeDefs = gql`
  type Post {
    id: Int!
    authorId: Int!
    body: String
    likes: Int
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
  }

  type Query {
    posts(pageSize: Int, skip: Int): [Post]
    post(id: ID!): Post
    postsByAuthor(authorId: Int!): [Post]
    user(id: ID!): User
  }

  type Mutation {
    likePost(userId: ID!, postId: ID!): LikeUpdateResponse!
    unlikePost(userId: ID!, postId: ID!): LikeUpdateResponse!
  }

  type LikeUpdateResponse {
    success: Boolean!
    postLikes: Int
  }
`;
