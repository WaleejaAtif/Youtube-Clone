
import "./VideoCard.css";

function VideoCard({ video, onVideoClick }) {
  return (
    <div
      className="video-card"
      onClick={() => onVideoClick(video)}
      style={{ cursor: "pointer" }}
    >
      <video
        className="video-thumbnail"
        src={video.videoUrl}
        muted
        preload="metadata"
      />

      <div className="video-info">
        <div className="channel-avatar">
          {(video.user?.name || "U").charAt(0).toUpperCase()}
        </div>

        <div className="video-details">
          <h3>{video.title}</h3>
          <p>{video.user?.name || "Unknown Channel"}</p>
          <p>{video.description || "No description available"}</p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
