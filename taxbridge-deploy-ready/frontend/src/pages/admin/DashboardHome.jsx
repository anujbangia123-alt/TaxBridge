import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Video, Download, MessageSquare, Star, BookOpen } from 'lucide-react';
import './DashboardHome.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DashboardHome = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    videos: 0,
    resources: 0,
    testimonials: 0,
    faqs: 0,
    kb_categories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogs, videos, resources, testimonials, faqs, kb] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/blogs`),
        axios.get(`${BACKEND_URL}/api/admin/videos`),
        axios.get(`${BACKEND_URL}/api/admin/resources`),
        axios.get(`${BACKEND_URL}/api/admin/testimonials`),
        axios.get(`${BACKEND_URL}/api/admin/faqs`),
        axios.get(`${BACKEND_URL}/api/admin/kb-categories`)
      ]);

      setStats({
        blogs: blogs.data.length,
        videos: videos.data.length,
        resources: resources.data.length,
        testimonials: testimonials.data.length,
        faqs: faqs.data.length,
        kb_categories: kb.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: FileText, label: 'Blog Posts', value: stats.blogs, color: '#9E2B25' },
    { icon: Video, label: 'Videos', value: stats.videos, color: '#A8823C' },
    { icon: Download, label: 'Resources', value: stats.resources, color: '#4A5568' },
    { icon: Star, label: 'Testimonials', value: stats.testimonials, color: '#9E2B25' },
    { icon: MessageSquare, label: 'FAQs', value: stats.faqs, color: '#A8823C' },
    { icon: BookOpen, label: 'KB Categories', value: stats.kb_categories, color: '#4A5568' }
  ];

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your content.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <a href="/admin/dashboard/blogs" className="action-card">
            <FileText size={24} />
            <span>Manage Blogs</span>
          </a>
          <a href="/admin/dashboard/videos" className="action-card">
            <Video size={24} />
            <span>Manage Videos</span>
          </a>
          <a href="/admin/dashboard/resources" className="action-card">
            <Download size={24} />
            <span>Manage Resources</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
