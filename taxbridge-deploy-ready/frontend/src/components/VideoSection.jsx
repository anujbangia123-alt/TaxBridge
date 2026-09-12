import React, { useState, useEffect } from 'react';
import { Play, Clock, Eye } from 'lucide-react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import './VideoSection.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [videoCategories, setVideoCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/videos`);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/video-categories`);
      setVideoCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredVideos =
    selectedCategory === 'All'
      ? videos
      : videos.filter((video) => video.category === selectedCategory);

  return (
    <section id="videos" className="video-section">
      <div className="section-head">
        <h2>Video Library</h2>
        <div className="section-num">06 / Videos</div>
      </div>

      <div className="video-categories">
        {videoCategories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="video-grid">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="video-card"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="play-overlay">
                <div className="play-button">
                  <Play size={32} fill="currentColor" />
                </div>
              </div>
              <span className="video-duration">{video.duration}</span>
            </div>
            <div className="video-card-content">
              <span className="video-category">{video.category}</span>
              <h4>{video.title}</h4>
              <p>{video.description}</p>
              <div className="video-meta">
                <span>
                  <Eye size={12} /> {video.views} views
                </span>
                <span>{new Date(video.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="video-dialog">
            <DialogHeader>
              <DialogTitle>{selectedVideo.title}</DialogTitle>
            </DialogHeader>
            <div className="video-player">
              {selectedVideo.video_type === 'youtube' ? (
                <>
                  <iframe
                    width="100%"
                    height="450"
                    src={`https://www.youtube.com/embed/${selectedVideo.video_id}?autoplay=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onError={() => {
                      console.error('YouTube embed failed - may be Shorts or restricted video');
                    }}
                  ></iframe>
                  <div style={{marginTop: '12px', textAlign: 'center'}}>
                    <a 
                      href={`https://www.youtube.com/watch?v=${selectedVideo.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--seal)',
                        textDecoration: 'underline',
                        fontSize: '13px',
                        fontFamily: 'IBM Plex Mono, monospace'
                      }}
                    >
                      Video not loading? Open in YouTube →
                    </a>
                  </div>
                </>
              ) : (
                <video
                  width="100%"
                  height="450"
                  controls
                  autoPlay
                  src={selectedVideo.video_url}
                >
                  Your browser does not support video playback.
                </video>
              )}
            </div>
            <p className="video-description">{selectedVideo.description}</p>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default VideoSection;
