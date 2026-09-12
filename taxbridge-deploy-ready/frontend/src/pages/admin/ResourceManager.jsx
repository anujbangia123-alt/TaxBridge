import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Upload, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import '../admin/BlogManager.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ResourceManager = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Templates',
    type: 'PDF',
    file_url: '',
    file_size: '',
    featured: false
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/resources`);
      setResources(response.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch resources", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload/document`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData({
        ...formData,
        file_url: response.data.url,
        file_size: response.data.size
      });
      
      toast({ title: "Success", description: "File uploaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload file", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingResource) {
        await axios.put(`${BACKEND_URL}/api/admin/resources/${editingResource.id}`, formData);
        toast({ title: "Success", description: "Resource updated successfully" });
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/resources`, formData);
        toast({ title: "Success", description: "Resource created successfully" });
      }
      
      fetchResources();
      handleCloseModal();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save resource", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/resources/${id}`);
      toast({ title: "Success", description: "Resource deleted successfully" });
      fetchResources();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      type: resource.type,
      file_url: resource.file_url,
      file_size: resource.file_size,
      featured: resource.featured
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingResource(null);
    setFormData({
      title: '',
      description: '',
      category: 'Templates',
      type: 'PDF',
      file_url: '',
      file_size: '',
      featured: false
    });
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="manager-loading">Loading resources...</div>;

  return (
    <div className="resource-manager">
      <div className="manager-header">
        <div>
          <h1>Resource Manager</h1>
          <p>Manage downloadable files (PDFs, Excel, Templates)</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add New Resource
        </Button>
      </div>

      <div className="manager-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="manager-stats">Total: {resources.length} resources</div>
      </div>

      <div className="blog-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Size</th>
              <th>Downloads</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((resource) => (
              <tr key={resource.id}>
                <td>
                  <div className="blog-title-cell">
                    <strong>{resource.title}</strong>
                    <span className="blog-excerpt">{resource.description.substring(0, 50)}...</span>
                  </div>
                </td>
                <td><span className="badge">{resource.category}</span></td>
                <td><span className="badge"><FileText size={12} /> {resource.type}</span></td>
                <td>{resource.file_size}</td>
                <td>{resource.downloads}</td>
                <td>{resource.featured ? '⭐' : '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(resource)} className="btn-icon">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(resource.id)} className="btn-icon btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredResources.length === 0 && (
          <div className="empty-state">
            <p>No resources found. Add your first resource!</p>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="blog-modal">
          <DialogHeader>
            <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-field">
              <Label>Upload File</Label>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                disabled={uploading}
              />
              {uploading && <small>Uploading...</small>}
              {formData.file_url && <small>✓ File uploaded: {formData.file_url}</small>}
            </div>

            <div className="form-field">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Resource title"
              />
            </div>

            <div className="form-field">
              <Label>Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows="3"
                placeholder="Resource description"
              />
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <Label>Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Templates</option>
                  <option>PDFs</option>
                  <option>Guides</option>
                  <option>Calculators</option>
                </select>
              </div>

              <div className="form-field">
                <Label>Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>Word</option>
                  <option>Calculator</option>
                </select>
              </div>
            </div>

            <div className="form-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                Featured Resource
              </label>
            </div>

            <div className="form-actions">
              <Button type="button" onClick={handleCloseModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="btn-primary" disabled={!formData.file_url}>
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceManager;
