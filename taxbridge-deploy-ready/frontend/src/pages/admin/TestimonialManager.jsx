import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import '../admin/BlogManager.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    avatar: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch testimonials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTestimonial) {
        await axios.put(`${BACKEND_URL}/api/admin/testimonials/${editingTestimonial.id}`, formData);
        toast({ title: "Success", description: "Testimonial updated successfully" });
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/testimonials`, formData);
        toast({ title: "Success", description: "Testimonial created successfully" });
      }
      
      fetchTestimonials();
      handleCloseModal();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save testimonial", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/testimonials/${id}`);
      toast({ title: "Success", description: "Testimonial deleted successfully" });
      fetchTestimonials();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete testimonial", variant: "destructive" });
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setFormData({ name: '', role: '', company: '', content: '', rating: 5, avatar: '' });
  };

  const filteredTestimonials = testimonials.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="manager-loading">Loading testimonials...</div>;

  return (
    <div className="blog-manager">
      <div className="manager-header">
        <div>
          <h1>Testimonial Manager</h1>
          <p>Manage client testimonials and reviews</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add New Testimonial
        </Button>
      </div>

      <div className="manager-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="manager-stats">Total: {testimonials.length} testimonials</div>
      </div>

      <div className="blog-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Rating</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestimonials.map((testimonial) => (
              <tr key={testimonial.id}>
                <td>
                  <div className="blog-title-cell">
                    <strong>{testimonial.name}</strong>
                    <span className="blog-excerpt">{testimonial.role}</span>
                  </div>
                </td>
                <td><span className="badge">{testimonial.company}</span></td>
                <td>
                  <div style={{display: 'flex', gap: '2px'}}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#A8823C" color="#A8823C" />
                    ))}
                  </div>
                </td>
                <td>{testimonial.content.substring(0, 60)}...</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(testimonial)} className="btn-icon">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(testimonial.id)} className="btn-icon btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTestimonials.length === 0 && (
          <div className="empty-state">
            <p>No testimonials found. Add your first testimonial!</p>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="blog-modal">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-row-2">
              <div className="form-field">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-field">
                <Label>Rating</Label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <Label>Role</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                  placeholder="CEO"
                />
              </div>

              <div className="form-field">
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div className="form-field">
              <Label>Testimonial Content</Label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                rows="5"
                placeholder="Write the testimonial here..."
              />
            </div>

            <div className="form-field">
              <Label>Avatar URL (optional)</Label>
              <Input
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                placeholder="https://example.com/avatar.jpg or leave empty for initials"
              />
            </div>

            <div className="form-actions">
              <Button type="button" onClick={handleCloseModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialManager;
