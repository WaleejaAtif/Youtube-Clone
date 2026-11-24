
function Navbar({ onMenuClick, onUploadClick }) {
  return (
    <nav className="navbar">
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>

      <div className="logo">
        <span>▶</span> YouTube
      </div>

      <div className="search-box">
        <input type="text" placeholder="Search" />
        <button>🔍</button>
      </div>

      <div className="navbar-actions">
        <button className="mic-btn">🎤</button>
        <button className="create-btn" onClick={onUploadClick}>
          ＋ Create
        </button>
        <button className="notification-btn">🔔</button>
        <div className="profile">👤</div>
      </div>
    </nav>
  );
}

export default Navbar;
