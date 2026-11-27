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

// Special characters ko safe banane ke liye
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Search uploaded videos by title (YouTube style)
// /search?q=race car          -> saare matching videos (max 50)
// /search?q=race car&limit=8  -> sirf top 8 (typing suggestions ke liye)
router.get("/search", async (req, res) => {
  try {
    const query = (req.query.q || "").trim().slice(0, 100);

    if (!query) {
      return res.json([]);
    }

    const limit = Math.min(parseInt(req.query.limit) || 50, 50);

    // "race car" -> har word title mein hona chahiye (kisi bhi order mein)
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6);

    const videos = await Video.find({
      $and: terms.map((term) => ({
        title: { $regex: escapeRegex(term), $options: "i" },
      })),
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // Ranking: title typed text se shuru ho -> kisi word se shuru ho -> baaki
    const lower = query.toLowerCase();
    const rank = (title) => {
      const t = title.toLowerCase();
      if (t.startsWith(lower)) return 0;
      if (t.split(/\s+/).some((word) => word.startsWith(lower))) return 1;
      return 2;
    };

    videos.sort((a, b) => rank(a.title) - rank(b.title));

    res.json(videos.slice(0, limit));
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
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
    { timestamp: timestamp },
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


// Delete video (only the owner can delete it)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!video) {
      return res.status(404).json({
        message: "Video not found or you are not authorized to delete it",
      });
    }

    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });

    // Delete video record from MongoDB
    await Video.deleteOne({ _id: video._id });

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ message: error.message });
  }
});


export default router;