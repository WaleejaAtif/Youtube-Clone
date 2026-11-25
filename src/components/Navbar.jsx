
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ onMenuClick, onUploadClick }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowProfileMenu(false);

    navigate("/login");
  };

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

        {user ? (
          <>
            <button className="notification-btn">🔔</button>

            <button
              className="profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              👤
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <p>{user.name || user.username || "User"}</p>
                <p>{user.email}</p>

                <hr />

                <button onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="signin-btn">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
