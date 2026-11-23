
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import VideoCard from "./VideoCard";
import Categories from "./Categories";
import videos from "../data/videos";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((previous) => !previous);
  };

  return (
    <div className={isSidebarOpen ? "page sidebar-collapsed" : "page"}>
      <Navbar onMenuClick={toggleSidebar} />

      <Categories />

      <div className="main-content">
        <Sidebar isOpen={isSidebarOpen} />

        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="content-area">
          <section className="video-grid">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </section>

          <section className="shorts-section">
            <div className="shorts-heading">
              <h2>
                <span className="shorts-logo">▶</span>
                Shorts
              </h2>
              <button className="shorts-menu" aria-label="Shorts menu">
                ⋮
              </button>
            </div>

            <div className="shorts-grid">
              {videos.slice(0, 5).map((video) => (
                <article className="short-card" key={`short-${video.id}`}>
                  <img src={video.thumbnail} alt={video.title} />
                  <h3>{video.title}</h3>
                  <p>{video.views}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
