const { gql } = require("apollo-server-koa");

export const typeDefs = gql`
  type Post {
    id: Int!
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
  }
`;
