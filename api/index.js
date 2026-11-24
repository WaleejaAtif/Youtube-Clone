
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";



const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/api", (req, res) => {
  res.json({ message: "YouTube Clone API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

export default app;
