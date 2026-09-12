import React, { useState, useEffect } from 'react';
import { Clock, User, Tag, ArrowRight } from 'lucide-react';
import axios from 'axios';
import './BlogSection.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/blog-categories`);
      setBlogCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredBlogs =
    selectedCategory === 'All'
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  const featuredBlog = blogs.find((blog) => blog.featured);
  const regularBlogs = filteredBlogs.filter((blog) => !blog.featured);

  if (loading) {
    return (
      <section id="blog" className="blog-section">
        <div className="section-head">
          <h2>Latest Insights</h2>
          <div className="section-num">05 / Blog</div>
        </div>
        <div style={{padding: '40px', textAlign: 'center', color: 'var(--ink-soft)'}}>
          Loading blogs...
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="blog-section">
      <div className="section-head">
        <h2>Latest Insights</h2>
        <div className="section-num">05 / Blog</div>
      </div>

      <div className="blog-categories">
        {blogCategories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {selectedCategory === 'All' && featuredBlog && (
        <div className="featured-blog">
          <div className="featured-blog-image">
            <img src={featuredBlog.image} alt={featuredBlog.title} />
            <span className="featured-badge">Featured</span>
          </div>
          <div className="featured-blog-content">
            <div className="blog-meta">
              <span className="blog-category">{featuredBlog.category}</span>
              <span className="blog-date">
                {new Date(featuredBlog.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <h3>{featuredBlog.title}</h3>
            <p>{featuredBlog.excerpt}</p>
            <div className="blog-footer">
              <div className="author-info">
                <img
                  src={featuredBlog.author_avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + featuredBlog.author_name}
                  alt={featuredBlog.author_name}
                  className="author-avatar"
                />
                <div>
                  <div className="author-name">{featuredBlog.author_name}</div>
                  <div className="author-role">{featuredBlog.author_role}</div>
                </div>
              </div>
              <div className="blog-read-time">
                <Clock size={14} />
                {featuredBlog.read_time}
              </div>
            </div>
            <button className="btn btn-primary">
              Read article <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="blog-grid">
        {regularBlogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <div className="blog-card-image">
              <img src={blog.image} alt={blog.title} />
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span className="blog-category">{blog.category}</span>
                <span className="blog-date">
                  {new Date(blog.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h4>{blog.title}</h4>
              <p>{blog.excerpt}</p>
              <div className="blog-card-footer">
                <div className="author-info-small">
                  <img
                    src={blog.author_avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + blog.author_name}
                    alt={blog.author_name}
                    className="author-avatar-small"
                  />
                  <span>{blog.author_name}</span>
                </div>
                <span className="read-time">
                  <Clock size={12} />
                  {blog.read_time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
