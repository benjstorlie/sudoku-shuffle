const { gql } = require("apollo-server-express");

const typeDefs = gql`

  type Game {
    _id: ID
    gameData: String
    difficulty: String
    elapsedTime: Number
    isSolved: Boolean
  }

  type Stats {
    difficulty: String
    bestTime: Number
    averageTime: Number
    numSolved: Int
  }

  type Profile {
    _id: ID
    name: String
    email: String
    password: String
    games: [Game]
    stats: [Stats]
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Query {
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: Profile
    game(gameId: ID!): Game
    games: [Game]
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addGame(gameData: String!, difficulty: String!, elapsedTime: Number): Game
    updateGame(gameId: ID!, gameData: String!, elapsedTime: Number!): Game
    removeGame(gameId: ID!): Game
    # Called when a game is finished
    updateStats(difficulty: String!, elapsedTime: Number!): Profile
  }
`;

module.exports = typeDefs;
