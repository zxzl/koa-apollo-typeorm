const { gql } = require("apollo-server-koa");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
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

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    posts(pageSize: Int, skip: Int): [Post]
    post(id: ID!): Post
  }
`;
