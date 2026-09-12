import React, { useState, useEffect } from 'react';
import { Download, FileText, File, Calculator, BookOpen } from 'lucide-react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from '../hooks/use-toast';
import './ResourceSection.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ResourceSection = () => {
  const [resources, setResources] = useState([]);
  const [resourceCategories, setResourceCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/resources`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/resource-categories`);
      setResourceCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredResources =
    selectedCategory === 'All'
      ? resources
      : resources.filter((resource) => resource.category === selectedCategory);

  const getIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText size={24} />;
      case 'Excel':
        return <File size={24} />;
      case 'Word':
        return <BookOpen size={24} />;
      case 'Calculator':
        return <Calculator size={24} />;
      default:
        return <FileText size={24} />;
    }
  };

  const handleDownloadRequest = (resource) => {
    setSelectedResource(resource);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Download Started!",
      description: `${selectedResource.title} will be downloaded shortly. Check your email for the download link.`,
    });
    setSelectedResource(null);
    setFormData({ name: '', email: '', company: '' });
  };

  return (
    <section id="resources" className="resource-section">
      <div className="section-head">
        <h2>Free Resources</h2>
        <div className="section-num">07 / Resources</div>
      </div>

      <p className="resource-intro">
        Download templates, calculators, guides, and practice workbooks to help with your transfer pricing and international tax compliance.
      </p>

      <div className="resource-categories">
        {resourceCategories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="resource-grid">
        {filteredResources.map((resource) => (
          <div key={resource.id} className={`resource-card ${resource.featured ? 'featured' : ''}`}>
            <div className="resource-icon">{getIcon(resource.type)}</div>
            <div className="resource-content">
              {resource.featured && <span className="featured-label">Popular</span>}
              <span className="resource-type">{resource.type}</span>
              <h4>{resource.title}</h4>
              <p>{resource.description}</p>
              <div className="resource-meta">
                <span>{resource.fileSize}</span>
                <span>{resource.downloads} downloads</span>
              </div>
            </div>
            <button
              className="btn btn-primary resource-download-btn"
              onClick={() => handleDownloadRequest(resource)}
            >
              <Download size={16} /> Download
            </button>
          </div>
        ))}
      </div>

      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="resource-dialog">
            <DialogHeader>
              <DialogTitle>Download {selectedResource.title}</DialogTitle>
              <DialogDescription>
                Please provide your details to receive the download link via email.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="resource-form">
              <div className="form-field">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-field">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Send Download Link
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default ResourceSection;
