import mongoose from "mongoose";

const playerSchema = mongoose.Schema({
  playerName: String,
  position: String,
  playerConstraints: [{ type: String }],
  playerGood: [
    {
      goodDetails: { type: String },
      goodTiming: { type: String }, // Stored in MM:SS format
    },
  ],
  playerBad: [
    {
      badDetails: { type: String },
      badTiming: { type: String }, // Stored in MM:SS format
    },
  ],
  videoPath: { type: String, default: null }, // Local file path for video
});

const Player = mongoose.model("Player", playerSchema);
export default Player;
