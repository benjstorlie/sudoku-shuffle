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
        return Profile.findOne({ _id: context.profile._id }).populate('games');
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    game: async (parent, { gameId }) => {
      return Game.findOne({ _id: gameId });
    },
    /** get unsolved games */
    games: async (parent, args, context) => {
      if (context.profile) {
        const profile = await Profile.findById(context.profile._id);
        
        if (!profile) {
          throw new Error('Profile not found.');
        }

        const unsolvedGames = await Game.find({
          _id: { $in: profile.games },
          isSolved: false
        });

        return unsolvedGames;
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
    updateGame: async (parent, { gameId, gameData, elapsedTime }, context) => {
      if (context.profile) {
        const profile = await Profile.findById(context.profile._id);

        if (!profile) {
          throw new Error('Profile not found.');
        }
    
        // Check if the gameId is in the profile's games array
        if (!profile.games.includes(gameId)) {
          throw new Error('You do not have permission to update this game.');
        }
        const game = await Game.findOneAndUpdate(
          { _id: gameId },
          { gameData, elapsedTime },
          { runValidators: true, new: true }
        );
  
        return game;
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
    /** 
     * When a game is solved, send its difficulty level and the time. This function uses the profiles current stats to update with the new data
     */
    updateStats: async (parent, { difficulty, elapsedTime }, context ) => {
      if (context.profile) {
        const profile = await Profile.findOne({ _id: context.profile._id } );
        // this user's stats array
        const stats = profile.stats
        // find index corresponding to this difficulty level
        const index = stats.findIndex(stat => stat.difficulty === difficulty);

        if (index === -1) {
          // Create new stats for this difficulty if it doesn't exist
          stats.push({
            difficulty,
            bestTime: elapsedTime,
            averageTime: elapsedTime,
            numSolved: 1
          });
        } else {
          // Update existing stats
          const statsData = stats[index];
          if (elapsedTime < statsData.bestTime) {
            statsData.bestTime = elapsedTime;
          }
          statsData.averageTime = (statsData.averageTime * statsData.numSolved + elapsedTime) / (statsData.numSolved + 1);
          statsData.numSolved += 1;
        }
      
        return profile.save();
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  },
};

module.exports = resolvers;
