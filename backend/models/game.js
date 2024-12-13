import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
