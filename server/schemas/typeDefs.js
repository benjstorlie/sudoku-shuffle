const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Game {
    _id: ID
    gameData: String
    difficulty: String
    elapsedTime: Float
    isSolved: Boolean
  }

  type Stats {
    difficulty: String
    bestTime: Float
    averageTime: Float
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

  # Returned for updating game. If game was won, stats will show the updated stats.
  type GameResult {
    game: Game
    stats: [Stats]
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Query {
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: Profile
    meWithGames(allGames:Boolean): Profile
    game(gameId: ID!): Game
    games(allGames:Boolean): [Game]
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addGame(gameData: String!, difficulty: String!, elapsedTime: Float): Game
    updateGame(gameId: ID!, gameData: String!, elapsedTime: Float!,isSolved:Boolean): GameResult
    removeGame(gameId: ID!): Game
  }
`;

module.exports = typeDefs;
