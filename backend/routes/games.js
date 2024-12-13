import express from "express";
import Game from "../models/game.js";
import Player from "../models/player.js"; // Import Player model to handle player-related operations
import multer from "multer"; // Middleware to handle file uploads
import cloudinary from "../cloudinaryConfig.js";


import fs from 'fs';
import { promisify } from 'util';

const router = express.Router();

// Get a specific game by ID
router.get("/game/:id", async (req, res) => {
  try {
    // Find the game by its ID and populate the 'players' array to include player data
    const game = await Game.findById(req.params.id).populate("players");
    console.log(game);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(game);
  } catch (error) {
    // Return a 400 status if any error occurs during the process
    res.status(400).json({ error: error.message });
  }
});

// Update a specific game by ID
router.put("/game/:id", async (req, res) => {
  try {
    // Find the game by its ID and update with new data from the request body
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
    });
    if (!updatedGame) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(updatedGame); // Return the updated game
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a specific game by ID
router.delete("/game/:id", async (req, res) => {
  try {
    // Find and delete the game by its ID
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json({ message: "Game deleted successfully" }); // Confirm deletion
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a new player to a specific game by gameId
router.post("/game/:gameId/player", async (req, res) => {
  try {
    // Find the game by its gameId from the request params
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Automatically assign a name to the new player based on the number of players
    const playerNumber = game.players.length + 1;
    const newPlayer = new Player({
      playerName: `Player ${playerNumber}`, // Automatically assign player name as "Player 1", "Player 2", etc.
      ...req.body, // Allow any additional data for the player (if provided) to be passed in the request body
    });

    // Save the new player to the database
    await newPlayer.save();

    // Add the new player's ID to the game's players array
    game.players.push(newPlayer._id);
    await game.save(); // Save the updated game with the new player

    res.status(201).json(newPlayer); // Respond with the newly created player
  } catch (error) {
    // Catch and return any errors during the process
    res.status(400).json({ error: error.message });
  }
});

// Delete a specific player by ID from a game
router.delete("/game/:gameId/player/:playerId", async (req, res) => {
  try {
    const { gameId, playerId } = req.params;

    // Find the game and remove the player from its 'players' array
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Remove the player reference from the game's players array
    game.players = game.players.filter(
      (player) => player.toString() !== playerId
    );
    await game.save();

    // Delete the player document itself
    await Player.findByIdAndDelete(playerId);

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;
