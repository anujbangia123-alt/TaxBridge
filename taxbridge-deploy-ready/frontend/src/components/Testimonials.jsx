import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import axios from 'axios';
import './Testimonials.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="testimonials" className="testimonials-section">
        <div className="section-head">
          <h2>Client Testimonials</h2>
          <div className="section-num">04 / Case Studies</div>
        </div>
        <div style={{padding: '40px', textAlign: 'center', color: 'var(--ink-soft)'}}>
          Loading testimonials...
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-head">
        <h2>Client Testimonials</h2>
        <div className="section-num">04 / Case Studies</div>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="quote-icon">
              <Quote size={32} />
            </div>
            <div className="rating">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
              ))}
            </div>
            <p className="testimonial-content">{testimonial.content}</p>
            <div className="testimonial-author">
              <img src={testimonial.avatar} alt={testimonial.name} />
              <div>
                <div className="author-name">{testimonial.name}</div>
                <div className="author-role">{testimonial.role}</div>
                <div className="author-company">{testimonial.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
