const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  boardData: Object,
  difficulty: String,
  givens: [[Number]],
  elapsedTime: Number,
  // Other game properties...
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
