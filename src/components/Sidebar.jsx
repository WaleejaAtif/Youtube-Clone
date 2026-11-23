


function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "show-sidebar" : ""}`}>
      <div className="sidebar-main-items">
        <div className="sidebar-item active">
          <span className="sidebar-icon">⌂</span>
          <span className="sidebar-text">Home</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">▣</span>
          <span className="sidebar-text">Shorts</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">▻</span>
          <span className="sidebar-text">Subscriptions</span>
        </div>
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-extra-items">
        <h3 className="sidebar-heading">You &gt;</h3>

        <div className="sidebar-item">
          <span className="sidebar-icon">◉</span>
          <span className="sidebar-text">Your Channel</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">◷</span>
          <span className="sidebar-text">History</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">▤</span>
          <span className="sidebar-text">Playlists</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">◴</span>
          <span className="sidebar-text">Watch Later</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">♡</span>
          <span className="sidebar-text">Liked Videos</span>
        </div>
      </div>

      <div className="sidebar-mobile-you">
        <div className="sidebar-item">
          <span className="sidebar-icon">◉</span>
          <span className="sidebar-text">You</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
