import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS module
import trainingRouter from "./routes/trainings.js";
import roundRouter from "./routes/rounds.js";
import gameRouter from "./routes/games.js";
import playerRouter from "./routes/players.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;
app.use(cors()); // Enable CORS for all routes and origins
app.use(express.json());
app.use("/api", trainingRouter);
app.use("/api", roundRouter);
app.use("/api", gameRouter);
app.use("/api", playerRouter);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
