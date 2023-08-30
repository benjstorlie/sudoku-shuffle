const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameData: String,
  difficulty: String,
  elapsedTime: Number,
  isSolved: Boolean
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
