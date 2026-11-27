
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import Categories from "../components/Categories";
import UploadModal from "../components/UploadModal";
import VideoPlayerModal from "../components/VideoPlayerModal";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((previous) => !previous);
  };

  const handleUploadSuccess = (newVideo) => {
    setVideos((previousVideos) => [newVideo, ...previousVideos]);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");

        if (!response.ok) {
          throw new Error("Failed to load videos");
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className={isSidebarOpen ? "page sidebar-collapsed" : "page"}>
     <Navbar
     
  onMenuClick={toggleSidebar}
  onVideoSelect={setSelectedVideo}
  onUploadClick={() => {
    alert("Create button clicked!");
    setIsUploadOpen(true);
  }}
/>
      

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
            {loading ? (
              <p>Loading videos...</p>
            ) : error ? (
              <p>{error}</p>
            ) : videos.length === 0 ? (
              <p>No videos uploaded yet.</p>
            ) : (
            videos.map((video) => (
  <VideoCard
    key={video._id}
    video={video}
    onVideoClick={setSelectedVideo}
  />
))
            )}
          </section>
        </main>
      </div>

      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
      {selectedVideo && (
  <VideoPlayerModal
    video={selectedVideo}
    onClose={() => setSelectedVideo(null)}
  />
)}
    </div>
  );
}

export default HomePage;
