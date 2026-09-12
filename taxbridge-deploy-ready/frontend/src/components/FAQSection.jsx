import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import './FAQSection.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
    fetchCategories();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/faqs`);
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/faq-categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  if (loading) {
    return (
      <section id="faq" className="faq-section">
        <div className="section-head">
          <h2>Frequently Asked Questions</h2>
          <div className="section-num">09 / FAQ</div>
        </div>
        <div style={{padding: '40px', textAlign: 'center', color: 'var(--ink-soft)'}}>
          Loading FAQs...
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="faq-section">
      <div className="section-head">
        <h2>Frequently Asked Questions</h2>
        <div className="section-num">09 / FAQ</div>
      </div>

      <div className="faq-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className={`faq-item ${openFaq === faq.id ? 'open' : ''}`}
          >
            <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
              <h4>{faq.question}</h4>
              <ChevronDown className="faq-icon" size={20} />
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
