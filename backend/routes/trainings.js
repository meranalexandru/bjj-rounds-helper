import Training from "../models/training.js";
import express from "express";

const router = express.Router();

router.post("/training", async (req, res) => {
  try {
    const { trainingName, trainingDate } = req.body
    const newTraining = new Training({ trainingName, trainingDate});
    await newTraining.save();
    res.status(201).json(newTraining);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all trainings
router.get("/trainings", async (req, res) => {
  try {
    const trainings = await Training.find().populate("rounds");
    res.status(200).json(trainings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific training by ID
router.get("/training/:id", async (req, res) => {
  try {
    const training = await Training.findById(req.params.id).populate("rounds");
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.status(200).json(training);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a specific training by ID
router.put("/training/:id", async (req, res) => {
  try {
    const updatedTraining = await Training.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("rounds");
    if (!updatedTraining) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.status(200).json(updatedTraining);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/training/:id", async (req, res) => {
  try {
    const deletedTraining = await Training.findByIdAndDelete(req.params.id);
    if (!deletedTraining) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.status(200).json({ message: "Training deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update the order of rounds for a specific training
router.put("/training/:trainingId/rounds/reorder", async (req, res) => {
  const { rounds } = req.body; // Expecting an array of round IDs in the new order

  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }

    // Validate that all rounds exist and belong to the training
    const validRounds = rounds.every((roundId) =>
      training.rounds.includes(roundId)
    );
    if (!validRounds) {
      return res.status(400).json({ error: "Invalid round IDs provided" });
    }

    // Update the order of rounds in the training
    training.rounds = rounds;
    await training.save();

    res.status(200).json({ message: "Round order updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
