
import "./VideoPlayerModal.css";

function VideoPlayerModal({ video, onClose }) {
  if (!video) return null;

  return (
    <div className="player-overlay" onClick={onClose}>
      <div
        className="player-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="player-header">
          <h2>{video.title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <video
          className="main-video-player"
          src={video.videoUrl}
          controls
          autoPlay
          playsInline
        />

        <div className="player-details">
          <h3>{video.title}</h3>
          <p>{video.user?.name || "Unknown Channel"}</p>
          <p>{video.description || "No description available"}</p>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerModal;
