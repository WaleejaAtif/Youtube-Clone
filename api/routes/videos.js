
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import Video from "../models/videos.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Get all videos (Homepage)
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get signed upload details
router.get("/upload-signature", authMiddleware, (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);

const signature = cloudinary.utils.api_sign_request(
  {
    timestamp: timestamp,
  },
  process.env.CLOUDINARY_API_SECRET
);

  res.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
});

// Save uploaded video details
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, videoUrl, publicId } = req.body;

    if (!title || !videoUrl || !publicId) {
      return res.status(400).json({
        message: "Title and uploaded video are required",
      });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      publicId,
      user: req.userId,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
