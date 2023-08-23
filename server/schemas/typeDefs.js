const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Game {
    _id: ID!
    userId: ID!
    boardData: JSON!
    difficulty: String!
    givens: [[Int!]!]!  # Array of arrays containing two integers
    elapsedTime: Float!
  }

  type Auth {
    token: ID!
    user: User
  }
  
  type User {
    _id: ID!
    # other fields
  }

  type Query {
    # the queries defined in ./resolvers.js
  }

  type Mutation {
    # the mutations defined in ./resolvers.js
  }
`;

module.exports = typeDefs;