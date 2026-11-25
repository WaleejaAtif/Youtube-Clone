
import { useState } from "react";
import "./VideoCard.css";

function VideoCard({ video, onVideoClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuAction = (e, action) => {
    e.stopPropagation();

    switch (action) {
      case "Download":
        window.open(video.videoUrl, "_blank");
        break;

      case "Save to playlist":
        alert("Playlist functionality will be added next.");
        break;

      case "Add to queue":
        alert("Video added to queue!");
        break;

      case "Save to Watch Later":
        alert("Watch Later functionality will be added next.");
        break;

      case "Share":
        navigator.clipboard.writeText(
          `${window.location.origin}/?video=${video._id}`
        );
        alert("Video link copied!");
        break;

      case "Not interested":
        alert("Video hidden from your recommendations.");
        break;

      case "Don't recommend channel":
        alert("Channel hidden from your recommendations.");
        break;

      case "Report":
        alert("Report functionality will be added next.");
        break;

      default:
        break;
    }

    setMenuOpen(false);
  };

  const menuItems = [
    ["⬇", "Download"],
    ["▤", "Save to playlist"],
    ["☷", "Add to queue"],
    ["◷", "Save to Watch Later"],
    ["↗", "Share"],
    ["◉", "Not interested"],
    ["⊘", "Don't recommend channel"],
    ["⚑", "Report"],
  ];

  return (
    <div
      className="video-card"
      onClick={() => onVideoClick(video)}
      style={{ cursor: "pointer" }}
    >
      <div className="video-thumbnail-wrapper">
        <video
          className="video-thumbnail"
          src={video.videoUrl}
          muted
          preload="metadata"
        />

        <button
          className="video-menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((previous) => !previous);
          }}
        >
          ⋮
        </button>

        {menuOpen && (
          <div
            className="video-menu"
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map(([icon, label]) => (
              <button
                className="video-menu-item"
                key={label}
                onClick={(e) => handleMenuAction(e, label)}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

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
