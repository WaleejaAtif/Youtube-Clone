
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import VideoCard from "./VideoCard";
import Categories from "./Categories";
import videos from "../data/videos";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={isSidebarOpen ? "page sidebar-collapsed" : "page"}>
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Categories />

      <div className="main-content">
        <Sidebar isOpen={isSidebarOpen} />

        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
