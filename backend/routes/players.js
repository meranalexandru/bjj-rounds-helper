import express from "express";
import Player from "../models/player.js";
import multer from "multer";
import cloudinary from "../cloudinaryConfig.js";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
// Set up Multer storage
// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // Resolve uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

router.put("/player/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const updates = req.body;

    // Find the player by ID and apply updates
    const updatedPlayer = await Player.findByIdAndUpdate(playerId, updates, {
      new: true, // Return the updated player document
    });

    if (!updatedPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json(updatedPlayer); // Return the updated player
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET route for fetching player by playerId
router.get("/player/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;

    // Find the player by ID
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get player data by ID
router.get("/player/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Update player data
router.put("/player/:id", async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/player/:playerId/video", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { videoPath } = req.body;

    const player = await Player.findByIdAndUpdate(
      playerId,
      { videoUrl: videoPath },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json({ message: "Video path saved successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete("/player/:playerId/video", async (req, res) => {
  console.log("s a intrat")
  try {
    const { playerId } = req.params;

    console.log(player)

    const player = await Player.findById(playerId);

    console.log(player)
    if (!player || !player.videoUrl) {
      return res.status(404).json({ error: "Video not found." });
    }

    // Update the videoUrl field to null.
    player.videoUrl = null;
    await player.save();

    res.status(200).json({ message: "Video path cleared successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put("/player/:playerId/upload", upload.single("video"), async (req, res) => {

  console.log("s a intrat pe put")
  try {
    const { playerId } = req.params;
    const path = req.body.videoPath;
      console.log(path)
    if (!path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save the local file path (accessible for frontend)
    const filePath = `file://${path}`; // Add 'file://' prefix for consistency with frontend URIs
    
    const player = await Player.findByIdAndUpdate(
      playerId,
      { videoPath: filePath },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json({ message: "Video uploaded successfully", videoPath: filePath });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
