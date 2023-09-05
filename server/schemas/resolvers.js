const { Game, Profile } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
// Other imports...

const resolvers = {
  Query: {
    // By adding context to our query, we can retrieve the logged in profile without specifically searching for them
    me: async (parent, args, context) => {
      if (context.profile) {
        return Profile.findOne({ _id: context.profile._id })
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    /** return profile with unsolved games */
    meWithGames: async (parent, { allGames }, context) => {
      if (context.profile) {
        const profile = await Profile.findOne({ _id: context.profile._id }).populate('games');

        if (allGames) {
          return profile;
        } else {
        // Filter out solved games
        profile.games = profile.games.filter(game => !game.isSolved);

        return profile;
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    game: async (parent, { gameId }) => {
      return Game.findOne({ _id: gameId });
    },
    /** get unsolved games */
    games: async (parent, { allGames }, context) => {
      if (context.profile) {
        const profile = await Profile.findOne({ _id: context.profile._id }).populate('games');

        if (allGames) {
          return profile.games;
        } else {
        // Filter out solved games
        profile.games = profile.games.filter(game => !game.isSolved);

        return profile.games;
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  },

  Mutation: {
    addProfile: async (parent, { name, email, password }) => {
      const profile = await Profile.create({ name, email, password });
      const token = signToken(profile);

      return { token, profile };
    },
    login: async (parent, { email, password }) => {
      const profile = await Profile.findOne({ email });

      if (!profile) {
        throw new AuthenticationError("No profile with this email found!");
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(profile);
      return { token, profile };
    },
    addGame: async (parent, { gameData, difficulty, elapsedTime }, context) => {
      if (context.profile) {
        const game = await Game.create({
          gameData,
          difficulty,
          elapsedTime: elapsedTime || 0
        });

        await Profile.findOneAndUpdate(
          { _id: context.profile._id },
          { $addToSet: { games: game._id } }
        );

        return game;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    updateGame: async (parent, { gameId, gameData, elapsedTime, isSolved }, context) => {
      if (context.profile) {
        const profile = await Profile.findById(context.profile._id);
    
        if (!profile) {
          throw new Error('Profile not found.');
        }
    
        // Check if the gameId is in the profile's games array
        if (!profile.games.includes(gameId)) {
          throw new Error('You do not have permission to update this game.');
        }
    
        // Find game
        let game = await Game.findById(gameId);
        
        // Did the game go from not solved to solved, i.e. was this the winning move?
        const won = !game.isSolved && isSolved;
        
        // update game and save
        if (gameData) {game.gameData = gameData;}
        if (isSolved) {game.isSolved = isSolved;}
        if (elapsedTime) {game.elapsedTime = elapsedTime;}

        await game.save();
    
        // If the game was won, update the user's stats
        if (won) {
          console.log('won')
          const difficulty = game.difficulty; 
    
          // Find or create the stats entry for this difficulty
          let statsEntry = profile.stats.find(stat => stat.difficulty === difficulty);
          if (!statsEntry) {
            profile.stats.push({
              difficulty,
              bestTime: elapsedTime,
              averageTime: elapsedTime,
              numSolved: 1
            });
          } else {
            if (elapsedTime < statsEntry.bestTime) {
              statsEntry.bestTime = elapsedTime;
            }
            statsEntry.averageTime =
              (statsEntry.averageTime * statsEntry.numSolved + elapsedTime) /
              (statsEntry.numSolved + 1);
            statsEntry.numSolved += 1;
          }
          
          await profile.save(); // Save the updated profile with updated stats
          console.log(profile.stats)
          return {game, stats: profile.stats}
        } else {
          return {game, stats: [] };
        }
        
      }
      throw new AuthenticationError('You need to be logged in!');
    },       
    removeGame: async (parent, { gameId }, context) => {
      if (context.profile) {
        const profile = await Profile.findOneAndUpdate(
          { _id: context.profile._id },
          { $pull: { games: gameId } },
        );

        if (!profile) {
          throw new Error('Profile not found.');
        }
    
        // Check if the gameId was in the profile's games array in the first place
        if (!profile.games.includes(gameId)) {
          throw new Error('You do not have permission to delete this game.');
        }
        const game = await Game.findOneAndDelete({
          _id: gameId,
        });

        return game;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  }
};

module.exports = resolvers;
