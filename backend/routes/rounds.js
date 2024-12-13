import express from "express";
import Training from "../models/training.js";
import Round from "../models/round.js";

const router = express.Router();

// Get all rounds based on training ID
router.get("/training/:trainingId/rounds", async (req, res) => {
  try {
    const training = await Training.findById(req.params.trainingId).populate(
      "rounds"
    );
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.status(200).json(training.rounds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific round by ID
router.get("/round/:id", async (req, res) => {
  try {
    const round = await Round.findById(req.params.id);
    console.log(req.body)
    if (!round) {
      return res.status(404).json({ error: "Round not found" });
    }
    res.status(200).json(round);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/training/:trainingId/round", async (req, res) => {
  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }

    const newRound = new Round(req.body);
    await newRound.save();

    training.rounds.push(newRound._id);
    await training.save();
    res.status(201).json(newRound);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a specific round by ID
router.put("/round/:id", async (req, res) => {
  try {
    const updatedRound = await Round.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("game");
    if (!updatedRound) {
      return res.status(404).json({ error: "Round not found" });
    }
    res.status(200).json(updatedRound);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/round/:id", async (req, res) => {
  try {
    const round = await Round.findById(req.params.id);
    if (!round) {
      return res.status(404).json({ error: "Round not found" });
    }

    // Trigger the pre('remove') middleware by calling deleteOne() on the document
    await round.deleteOne();
    res
      .status(200)
      .json({ message: "Round and associated game deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
