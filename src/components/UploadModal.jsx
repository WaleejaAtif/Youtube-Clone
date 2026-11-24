
import { useState } from "react";
import "./UploadModal.css";

function UploadModal({ onClose, onUploadSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setMessage("Please select a video first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Preparing video upload...");

      // Step 1: Get Cloudinary upload signature
      const signatureResponse = await fetch(
        "/api/videos/upload-signature",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const signatureData = await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(signatureData.message || "Could not prepare upload.");
      }

      // Step 2: Upload video to Cloudinary
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);

      setMessage("Uploading video to Cloudinary...");


const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/video/upload`;

const CHUNK_SIZE = 6 * 1024 * 1024;
const uploadId = String(Date.now());

let cloudinaryData = null;

for (let start = 0; start < videoFile.size; start += CHUNK_SIZE) {
  const end = Math.min(start + CHUNK_SIZE, videoFile.size);
  const chunk = videoFile.slice(start, end);

  const chunkForm = new FormData();
  chunkForm.append("file", chunk);
  chunkForm.append("api_key", signatureData.apiKey);
  chunkForm.append("timestamp", signatureData.timestamp);
  chunkForm.append("signature", signatureData.signature);

  setMessage(
    `Uploading video... ${Math.round((end / videoFile.size) * 100)}%`
  );

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "X-Unique-Upload-Id": uploadId,
      "Content-Range": `bytes ${start}-${end - 1}/${videoFile.size}`,
    },
    body: chunkForm,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Chunk upload failed.");
  }

  cloudinaryData = data;
}

      // Step 3: Save video details in MongoDB
      setMessage("Saving video details...");

      const saveResponse = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
        }),
      });

      const savedVideo = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(savedVideo.message || "Could not save video details.");
      }

      setMessage("Video uploaded successfully!");

      if (onUploadSuccess) {
        onUploadSuccess(savedVideo);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-overlay">
      <div className="upload-modal">
        <div className="upload-header">
          <h2>Upload Video</h2>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleUpload}>
          <label>Choose Video</label>
          <input
            type="file"
            accept="video/*"
            required
            onChange={(e) => setVideoFile(e.target.files[0])}
          />

          <label>Video Title</label>
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Enter video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Video"}
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default UploadModal;
