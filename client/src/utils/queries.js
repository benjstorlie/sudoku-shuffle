import { gql } from "@apollo/client";

export const QUERY_ME_WITHOUT_GAMES = gql`
  query me {
    me {
      _id
      name
      email
      password
      stats {
        difficulty
        bestTime
        averageTime
        numSolved
      }
    }
  }
`;

export const QUERY_ME = gql`
  query meWithGames {
    meWithGames {
      _id
      name
      email
      password
      games {
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

export const QUERY_GAME = gql`
  query Game {
    games {
      _id
      gameData
      difficulty
      elapsedTime
    }
  }
`

export const QUERY_UNSOLVED_GAMES = gql`
  query Games($allGames: Boolean) {
    games(allGames: $allGames) {
      _id
      gameData
      difficulty
      elapsedTime
    }
  }
`