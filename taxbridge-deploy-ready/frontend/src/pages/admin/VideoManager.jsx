import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Youtube, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import '../admin/BlogManager.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TP Study',
    duration: '',
    video_type: 'youtube',
    video_id: '',
    video_url: '',
    thumbnail: ''
  });
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/videos`);
      setVideos(response.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch videos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingThumbnail(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload/image`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData({
        ...formData,
        thumbnail: `${BACKEND_URL}${response.data.url}`
      });
      
      toast({ title: "Success", description: "Thumbnail uploaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload thumbnail", variant: "destructive" });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingVideo) {
        await axios.put(`${BACKEND_URL}/api/admin/videos/${editingVideo.id}`, formData);
        toast({ title: "Success", description: "Video updated successfully" });
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/videos`, formData);
        toast({ title: "Success", description: "Video created successfully" });
      }
      
      fetchVideos();
      handleCloseModal();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save video", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/videos/${id}`);
      toast({ title: "Success", description: "Video deleted successfully" });
      fetchVideos();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete video", variant: "destructive" });
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      category: video.category,
      duration: video.duration,
      video_type: video.video_type,
      video_id: video.video_id || '',
      video_url: video.video_url || '',
      thumbnail: video.thumbnail || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      category: 'TP Study',
      duration: '',
      video_type: 'youtube',
      video_id: '',
      video_url: '',
      thumbnail: ''
    });
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="manager-loading">Loading videos...</div>;

  return (
    <div className="video-manager">
      <div className="manager-header">
        <div>
          <h1>Video Manager</h1>
          <p>Manage YouTube videos and uploads</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add New Video
        </Button>
      </div>

      <div className="manager-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="manager-stats">Total: {videos.length} videos</div>
      </div>

      <div className="blog-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((video) => (
              <tr key={video.id}>
                <td>
                  <div className="blog-title-cell">
                    <strong>{video.title}</strong>
                    <span className="blog-excerpt">{video.description.substring(0, 60)}...</span>
                  </div>
                </td>
                <td><span className="badge">{video.category}</span></td>
                <td>
                  {video.video_type === 'youtube' ? (
                    <span className="badge"><Youtube size={12} /> YouTube</span>
                  ) : (
                    <span className="badge"><Upload size={12} /> Upload</span>
                  )}
                </td>
                <td>{video.duration}</td>
                <td>{video.views}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(video)} className="btn-icon">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(video.id)} className="btn-icon btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVideos.length === 0 && (
          <div className="empty-state">
            <p>No videos found. Add your first video!</p>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="blog-modal">
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-field">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Video title"
              />
            </div>

            <div className="form-field">
              <Label>Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows="3"
                placeholder="Video description"
              />
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <Label>Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>TP Study</option>
                  <option>Form 3CEB</option>
                  <option>Form 41/10F</option>
                  <option>Knowledge</option>
                </select>
              </div>

              <div className="form-field">
                <Label>Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="15:42"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <Label>Video Type</Label>
              <select
                value={formData.video_type}
                onChange={(e) => setFormData({...formData, video_type: e.target.value})}
              >
                <option value="youtube">YouTube</option>
                <option value="upload">Uploaded Video</option>
              </select>
            </div>

            {formData.video_type === 'youtube' ? (
              <div className="form-field">
                <Label>YouTube Video ID</Label>
                <Input
                  value={formData.video_id}
                  onChange={(e) => setFormData({...formData, video_id: e.target.value})}
                  placeholder="dQw4w9WgXcQ"
                  required
                />
                <small>Get from YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong></small>
                <small style={{color: 'var(--seal)', marginTop: '4px', display: 'block'}}>
                  ⚠️ Note: YouTube Shorts may not embed properly. Use regular YouTube videos for best results.
                </small>
              </div>
            ) : (
              <div className="form-field">
                <Label>Video File URL</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  placeholder="/uploads/video.mp4"
                  required
                />
                <small>Upload video using API first, then paste URL here</small>
              </div>
            )}

            <div className="form-field">
              <Label>Thumbnail Image</Label>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <input
                  type="file"
                  onChange={handleThumbnailUpload}
                  accept="image/*"
                  disabled={uploadingThumbnail}
                  style={{
                    padding: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--paper)',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontSize: '14px'
                  }}
                />
                {uploadingThumbnail && <small>Uploading thumbnail...</small>}
                {formData.thumbnail && (
                  <div style={{marginTop: '8px'}}>
                    <small style={{color: 'green'}}>✓ Thumbnail uploaded</small>
                    <img 
                      src={formData.thumbnail} 
                      alt="Thumbnail preview" 
                      style={{
                        maxWidth: '200px',
                        marginTop: '8px',
                        border: '1px solid var(--line)'
                      }}
                    />
                  </div>
                )}
              </div>
              <small>Or paste thumbnail URL below</small>
            </div>

            <div className="form-field">
              <Label>Thumbnail URL (optional)</Label>
              <Input
                value={formData.thumbnail}
                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
              />
              <small>Leave empty to auto-generate from YouTube, or upload image above</small>
            </div>

            <div className="form-actions">
              <Button type="button" onClick={handleCloseModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                {editingVideo ? 'Update Video' : 'Create Video'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoManager;
