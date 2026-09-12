import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import './BlogManager.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Transfer Pricing',
    tags: '',
    author_name: 'Anuj Bangia',
    author_role: 'Transfer Pricing Specialist',
    read_time: '5 min read',
    featured: false,
    published: true,
    image: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/blogs`);
      setBlogs(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload/image`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData({
        ...formData,
        image: `${BACKEND_URL}${response.data.url}`
      });
      
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const blogData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    try {
      if (editingBlog) {
        await axios.put(`${BACKEND_URL}/api/admin/blogs/${editingBlog.id}`, blogData);
        toast({ title: "Success", description: "Blog updated successfully" });
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/blogs`, blogData);
        toast({ title: "Success", description: "Blog created successfully" });
      }
      
      fetchBlogs();
      handleCloseModal();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save blog",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/blogs/${id}`);
      toast({ title: "Success", description: "Blog deleted successfully" });
      fetchBlogs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags.join(', '),
      author_name: blog.author_name,
      author_role: blog.author_role,
      read_time: blog.read_time,
      featured: blog.featured,
      published: blog.published,
      image: blog.image || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Transfer Pricing',
      tags: '',
      author_name: 'Anuj Bangia',
      author_role: 'Transfer Pricing Specialist',
      read_time: '5 min read',
      featured: false,
      published: true,
      image: ''
    });
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="manager-loading">Loading blogs...</div>;
  }

  return (
    <div className="blog-manager">
      <div className="manager-header">
        <div>
          <h1>Blog Manager</h1>
          <p>Create and manage blog posts</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add New Blog
        </Button>
      </div>

      <div className="manager-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="manager-stats">
          Total: {blogs.length} | Published: {blogs.filter(b => b.published).length}
        </div>
      </div>

      <div className="blog-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <div className="blog-title-cell">
                    <strong>{blog.title}</strong>
                    <span className="blog-excerpt">{blog.excerpt.substring(0, 60)}...</span>
                  </div>
                </td>
                <td><span className="badge">{blog.category}</span></td>
                <td>
                  <span className={`status-badge ${blog.published ? 'published' : 'draft'}`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{blog.featured ? '⭐' : '-'}</td>
                <td>{new Date(blog.date).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(blog)} className="btn-icon">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(blog.id)} className="btn-icon btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBlogs.length === 0 && (
          <div className="empty-state">
            <p>No blogs found. Create your first blog post!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="blog-modal">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-row">
              <div className="form-field">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter blog title"
                />
              </div>
            </div>

            <div className="form-field">
              <Label>Excerpt</Label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                required
                placeholder="Short description"
                rows="2"
              />
            </div>

            <div className="form-field">
              <Label>Content (HTML)</Label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                placeholder="<p>Your blog content here...</p>"
                rows="6"
              />
              <small>Use HTML tags for formatting. TipTap editor coming soon!</small>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <Label>Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Transfer Pricing</option>
                  <option>Tax Updates</option>
                  <option>Case Studies</option>
                </select>
              </div>

              <div className="form-field">
                <Label>Read Time</Label>
                <Input
                  value={formData.read_time}
                  onChange={(e) => setFormData({...formData, read_time: e.target.value})}
                  placeholder="5 min read"
                />
              </div>
            </div>

            <div className="form-field">
              <Label>Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="form-field">
              <Label>Featured Image</Label>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={uploadingImage}
                  style={{
                    padding: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--paper)',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontSize: '14px'
                  }}
                />
                {uploadingImage && <small>Uploading image...</small>}
                {formData.image && (
                  <div style={{marginTop: '8px'}}>
                    <small style={{color: 'green'}}>✓ Image uploaded</small>
                    <img 
                      src={formData.image} 
                      alt="Blog preview" 
                      style={{
                        maxWidth: '200px',
                        marginTop: '8px',
                        border: '1px solid var(--line)'
                      }}
                    />
                  </div>
                )}
              </div>
              <small>Or paste image URL below</small>
            </div>

            <div className="form-field">
              <Label>Image URL (optional)</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                Featured Post
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                />
                Published
              </label>
            </div>

            <div className="form-actions">
              <Button type="button" onClick={handleCloseModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
