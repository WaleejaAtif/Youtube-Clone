import "./VideoCard.css";

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <img
        className="video-thumbnail"
        src={video.thumbnail}
        alt={video.title}
      />

      <div className="video-info">
        <div className="channel-avatar">
          {video.channel.charAt(0)}
        </div>

        <div className="video-details">
          <h3>{video.title}</h3>
          <p>{video.channel}</p>
          <p>{video.views} • {video.time}</p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;