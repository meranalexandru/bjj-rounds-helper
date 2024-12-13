// round.js
import mongoose from "mongoose";
import Game from './game.js';

const roundSchema = mongoose.Schema({
  roundType: String,
  roundDuration: Number,
  roundName: String,
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
  },
});

roundSchema.pre("remove", async function (next) {
  try {
    await this.model("Game").findByIdAndDelete(this.game);
    next();
  } catch (err) {
    next(err);
  }
});

roundSchema.pre("save", async function (next) {
  if (this.roundType === "round" && !this.game) {
    try {
      const newGame = new Game();
      await newGame.save();
      this.game = newGame._id;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const Round = mongoose.model("Round", roundSchema);
export default Round;
