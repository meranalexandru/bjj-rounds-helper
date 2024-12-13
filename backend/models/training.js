// training.js
import mongoose from "mongoose";

const trainingSchema = mongoose.Schema({
  trainingName: String,
  rounds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
    },
  ],
  trainingDate: Date,
});

const Training = mongoose.model("Training", trainingSchema);
export default Training;
