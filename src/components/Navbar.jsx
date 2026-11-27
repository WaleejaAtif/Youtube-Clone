import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const MAX_HISTORY = 10;
const SUGGESTION_LIMIT = 8;
const REFRESH_TIME = 30 * 1000;

function Navbar({ onMenuClick, onUploadClick, onVideoSelect }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const loadingRef = useRef(false);
  const lastLoadRef = useRef(0);

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // searchQuery = input mein jo dikh raha hai
  // typedQuery  = jo user ne khud type kiya (suggestions isi se aate hain)
  const [searchQuery, setSearchQuery] = useState("");
  const [typedQuery, setTypedQuery] = useState("");
  const [allVideos, setAllVideos] = useState([]);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAll, setShowAll] = useState(false); // Enter dabane ke baad saare results
  const [activeIndex, setActiveIndex] = useState(-1);

  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("searchHistory"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const hasTyped = typedQuery.trim().length > 0;

  // ---------- Videos ek baar load (phir search instant, server ka wait nahi) ----------
  const loadVideos = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      const response = await fetch("/api/videos");
      if (!response.ok) throw new Error("Could not load videos");

      const data = await response.json();

      if (Array.isArray(data)) {
        setAllVideos(data);
        lastLoadRef.current = Date.now();
      }
    } catch (error) {
      console.error("Load videos error:", error);
    } finally {
      loadingRef.current = false;
      setVideosLoaded(true);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // ---------- Matching videos (instant, typing ke saath) ----------
  const results = useMemo(() => {
    const query = typedQuery.trim().toLowerCase();
    if (!query) return [];

    // "race car" -> har word title mein hona chahiye (kisi bhi order mein)
    const terms = query.split(/\s+/);

    const rank = (title) => {
      const t = title.toLowerCase();
      if (t.startsWith(query)) return 0;
      if (t.split(/\s+/).some((word) => word.startsWith(query))) return 1;
      return 2;
    };

    return allVideos
      .filter((video) => {
        const title = (video.title || "").toLowerCase();
        return terms.every((term) => title.includes(term));
      })
      .sort((a, b) => rank(a.title) - rank(b.title));
  }, [typedQuery, allVideos]);

  // Typing mein top 8, Enter ke baad saare
  const suggestions = showAll ? results : results.slice(0, SUGGESTION_LIMIT);

  // Dropdown ki list: type kiya ho to videos, warna recent searches
  const items = hasTyped
    ? suggestions.map((video) => ({ type: "video", text: video.title, video }))
    : searchHistory.map((text) => ({ type: "history", text }));

  // Bahar click karne par dropdown band
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // ---------- Recent searches ----------
  const persistHistory = (updated) => {
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const saveSearchHistory = (query) => {
    persistHistory(
      [
        query,
        ...searchHistory.filter(
          (item) => item.toLowerCase() !== query.toLowerCase()
        ),
      ].slice(0, MAX_HISTORY)
    );
  };

  const removeFromHistory = (item) => {
    persistHistory(searchHistory.filter((h) => h !== item));
  };

  // ---------- Search (Enter ya history click): saare matching videos ----------
 
const runSearch = (value) => {
  const query = value.trim();

  if (!query) return;

  saveSearchHistory(query);
  setSearchQuery(query);
  setTypedQuery(query);
  setActiveIndex(-1);
  setShowAll(false);
  setShowSuggestions(false);

  navigate(`/search?q=${encodeURIComponent(query)}`);
};


  const openVideo = (video) => {
    saveSearchHistory(video.title);
    onVideoSelect(video);
    setSearchQuery("");
    setTypedQuery("");
    setShowSuggestions(false);
    setShowAll(false);
    setActiveIndex(-1);
    setMobileSearchOpen(false);
  };

  const handleItemClick = (item) => {
    if (item.type === "video") {
      openVideo(item.video);
    } else {
      runSearch(item.text);
    }
  };

  // Enter key

const handleSearchSubmit = (e) => {
  e.preventDefault();

  const active = items[activeIndex];
  const query = active ? active.text : searchQuery;

  runSearch(query);
};


  // Arrow Up / Down / Escape (jese YouTube mein)
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
      return;
    }

    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowSuggestions(true);
      const next = activeIndex + 1 >= items.length ? -1 : activeIndex + 1;
      setActiveIndex(next);
      setSearchQuery(next === -1 ? typedQuery : items[next].text);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setShowSuggestions(true);
      const prev = activeIndex - 1 < -1 ? items.length - 1 : activeIndex - 1;
      setActiveIndex(prev);
      setSearchQuery(prev === -1 ? typedQuery : items[prev].text);
    }
  };

  // Typed hissa normal, baaki bold (YouTube style)
  const renderTitle = (text) => {
    const base = typedQuery.trim();

    if (base && text.toLowerCase().startsWith(base.toLowerCase())) {
      return (
        <>
          {text.slice(0, base.length)}
          <b>{text.slice(base.length)}</b>
        </>
      );
    }

    return text;
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen((previous) => !previous);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/login");
  };

  const itemStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "14px",
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 16px",
    cursor: "pointer",
    textAlign: "left",
    color: "#fff",
    background: active ? "#3a3a3a" : "transparent",
  });

  const dropdownVisible =
    showSuggestions &&
    (!hasTyped || suggestions.length > 0 || showAll || !videosLoaded);

  return (
    <nav className="navbar">
      <button className="menu-btn" onClick={onMenuClick} type="button">
        ☰
      </button>

      <div className="logo">
        <span>▶</span> YouTube
      </div>

      {/* Mobile search toggle */}
      <button
        className="mobile-search-btn"
        type="button"
        onClick={toggleMobileSearch}
        aria-label="Open search"
      >
        <svg
          viewBox="0 0 24 24"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </button>

      {/* Search */}
      <div
        className={`search-container ${
          mobileSearchOpen ? "mobile-search-active" : ""
        }`}
        ref={searchRef}
      >
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={searchQuery}
            autoComplete="off"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setTypedQuery(e.target.value);
              setActiveIndex(-1);
              setShowAll(false);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setShowSuggestions(true);
              if (Date.now() - lastLoadRef.current > REFRESH_TIME) {
                loadVideos();
              }
            }}
            onKeyDown={handleKeyDown}
            aria-label="Search uploaded videos"
          />

          <button
            type="submit"
            className="search-submit"
            aria-label="Search"
          >
            <svg
              viewBox="0 0 24 24"
              width="23"
              height="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>
        </form>

        {dropdownVisible && (
          <div
            className="search-suggestions"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {!hasTyped && (
              <>
                {searchHistory.length === 0 && (
                  <div className="search-message">No recent searches</div>
                )}

                {items.map((item, index) => (
                  <div
                    key={`${item.text}-${index}`}
                    className="search-suggestion-item"
                    style={itemStyle(index === activeIndex)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleItemClick(item)}
                  >
                    <span>🕘</span>
                    <span style={{ flex: 1 }}>{item.text}</span>

                    <button
                      type="button"
                      aria-label={`Remove ${item.text}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.text);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#aaa",
                        cursor: "pointer",
                        fontSize: "13px",
                        padding: "4px 6px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </>
            )}

            {hasTyped && !videosLoaded && (
              <div className="search-message">Loading...</div>
            )}

            {hasTyped &&
              videosLoaded &&
              showAll &&
              suggestions.length === 0 && (
                <div className="search-message">No videos found</div>
              )}

            {hasTyped &&
              items.map((item, index) => (
                <div
                  key={item.video._id}
                  className="search-suggestion-item"
                  style={itemStyle(index === activeIndex)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleItemClick(item)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="19"
                    height="19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ flexShrink: 0 }}
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>

                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {renderTitle(item.text)}
                  </span>

                  {showAll && item.video.user?.name && (
                    <span style={{ color: "#aaa", fontSize: "12px" }}>
                      {item.video.user.name}
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Navbar actions */}
      <div className="navbar-actions">
        <button className="mic-btn" type="button">
          🎤
        </button>

        <button className="create-btn" onClick={onUploadClick} type="button">
          ＋ Create
        </button>

        {user ? (
          <>
            <button className="notification-btn" type="button">
              🔔
            </button>

            <button
              className="profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              type="button"
            >
              👤
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <p>{user.name || user.username || "User"}</p>
                <p>{user.email}</p>
                <hr />
                <button onClick={handleLogout} type="button">
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