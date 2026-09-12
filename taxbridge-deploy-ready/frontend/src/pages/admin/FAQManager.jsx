import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import '../admin/BlogManager.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/faqs`);
      setFaqs(response.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch FAQs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFaq) {
        await axios.put(`${BACKEND_URL}/api/admin/faqs/${editingFaq.id}`, formData);
        toast({ title: "Success", description: "FAQ updated successfully" });
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/faqs`, formData);
        toast({ title: "Success", description: "FAQ created successfully" });
      }
      
      fetchFaqs();
      handleCloseModal();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save FAQ", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/faqs/${id}`);
      toast({ title: "Success", description: "FAQ deleted successfully" });
      fetchFaqs();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete FAQ", variant: "destructive" });
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'General', order: 0 });
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="manager-loading">Loading FAQs...</div>;

  return (
    <div className="blog-manager">
      <div className="manager-header">
        <div>
          <h1>FAQ Manager</h1>
          <p>Manage frequently asked questions</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add New FAQ
        </Button>
      </div>

      <div className="manager-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="manager-stats">Total: {faqs.length} FAQs</div>
      </div>

      <div className="blog-table">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaqs.map((faq) => (
              <tr key={faq.id}>
                <td>
                  <div className="blog-title-cell">
                    <strong>{faq.question}</strong>
                    <span className="blog-excerpt">{faq.answer.substring(0, 80)}...</span>
                  </div>
                </td>
                <td><span className="badge">{faq.category}</span></td>
                <td>{faq.order}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(faq)} className="btn-icon">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(faq.id)} className="btn-icon btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFaqs.length === 0 && (
          <div className="empty-state">
            <p>No FAQs found. Add your first FAQ!</p>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="blog-modal">
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-field">
              <Label>Question</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                required
                placeholder="What is transfer pricing?"
              />
            </div>

            <div className="form-field">
              <Label>Answer</Label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                required
                rows="5"
                placeholder="Detailed answer..."
              />
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <Label>Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>General</option>
                  <option>Compliance</option>
                  <option>Forms</option>
                  <option>Services</option>
                </select>
              </div>

              <div className="form-field">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="button" onClick={handleCloseModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                {editingFaq ? 'Update FAQ' : 'Create FAQ'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQManager;
