import { gql } from "@apollo/client";

export const ADD_PROFILE = gql`
  mutation addProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const ADD_GAME = gql`
  mutation addGame($gameData: String!, $difficulty: String!, $elapsedTime: Float) {
    addGame(gameData: $gameData, difficulty: $difficulty, elapsedTime: $elapsedTime) {
      _id
      gameData
      difficulty
      elapsedTime
      isSolved
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation updateGame($gameId: ID!, $gameData: String!, $elapsedTime: Float!, $isSolved: Boolean) {
    updateGame(gameId: $gameId, gameData: $gameData, elapsedTime: $elapsedTime, isSolved: $isSolved) {
      game {
        _id
        gameData
        difficulty
        elapsedTime
        isSolved
      }
      stats {
        difficulty
        bestTime
        averageTime
        numSolved
      }
    }
  }
`;

export const REMOVE_GAME = gql`
  mutation removeGame($gameId: ID!) {
    removeGame(gameId: $gameId) {
      _id
    }
  }
`