
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import Categories from "../components/Categories";
import UploadModal from "../components/UploadModal";
import VideoPlayerModal from "../components/VideoPlayerModal";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/videos");

        if (!response.ok) {
          throw new Error("Failed to load videos");
        }

        const data = await response.json();
        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const filteredVideos = videos.filter((video) => {
    const title = (video.title || "").toLowerCase();
    return terms.every((term) => title.includes(term));
  });

  return (
    <div className={isSidebarOpen ? "page sidebar-collapsed" : "page"}>
      <Navbar
        onMenuClick={() => setIsSidebarOpen((previous) => !previous)}
        onVideoSelect={setSelectedVideo}
        onUploadClick={() => setIsUploadOpen(true)}
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
         <h2>
  Search results for: {query}
  {!loading && !error && (
    <span> ({filteredVideos.length} videos)</span>
  )}
</h2>

     
<section className="video-grid">
  {!query.trim() ? (
    <p>Please enter something to search.</p>
  ) : loading ? (
    <p>Loading videos...</p>
  ) : error ? (
    <p>{error}</p>
  ) : filteredVideos.length === 0 ? (
    <p>No videos found for "{query}".</p>
  ) : (
    filteredVideos.map((video) => (
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
          onUploadSuccess={(newVideo) => {
            setVideos((previous) => [newVideo, ...previous]);
            setIsUploadOpen(false);
          }}
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

export default SearchResults;
