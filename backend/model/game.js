const { Schema, model } = require("mongoose");

const GameSchema = new Schema({
  // 직업
  job: {
    type: String,
    required: true,
  },
});

const Game = model("game", GameSchema);

module.exports = Game;
