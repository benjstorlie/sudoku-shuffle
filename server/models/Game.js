const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameData: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  elapsedTime: {
    type: Number,
    default: 0,
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
