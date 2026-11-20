import "./Sidebar.css";


function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "collapsed" : ""}`}>
      <div className="sidebar-item active">
        <span className="sidebar-icon">🏠</span>
        <span className="sidebar-text">Home</span>
      </div>

      <div className="sidebar-item">
        <span className="sidebar-icon">🎬</span>
        <span className="sidebar-text">Shorts</span>
      </div>

      <div className="sidebar-item">
        <span className="sidebar-icon">📺</span>
        <span className="sidebar-text">Subscriptions</span>
      </div>

      <hr />

      <h3 className="sidebar-heading">You &gt;</h3>

      <div className="sidebar-item">
        <span className="sidebar-icon">👤</span>
        <span className="sidebar-text">Your Channel</span>
      </div>

      <div className="sidebar-item">
        <span className="sidebar-icon">🕘</span>
        <span className="sidebar-text">History</span>
      </div>

      <div className="sidebar-item">
        <span className="sidebar-icon">📋</span>
        <span className="sidebar-text">Playlists</span>
      </div>

      <div className="sidebar-item">
        <span className="sidebar-icon">⏰</span>
        <span className="sidebar-text">Watch Later</span>
      </div>

      <div className="sidebar-item">
        <span className="sidebar-icon">👍</span>
        <span className="sidebar-text">Liked Videos</span>
      </div>
    </aside>
  );
}

export default Sidebar;
