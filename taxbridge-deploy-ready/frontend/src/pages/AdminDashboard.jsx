import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  Download, 
  MessageSquare, 
  Star,
  BookOpen,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import './AdminDashboard.css';

// Import admin pages (we'll create these)
import BlogManager from './admin/BlogManager';
import VideoManager from './admin/VideoManager';
import ResourceManager from './admin/ResourceManager';
import TestimonialManager from './admin/TestimonialManager';
import FAQManager from './admin/FAQManager';
import KBManager from './admin/KBManager';
import DashboardHome from './admin/DashboardHome';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FileText, label: 'Blogs', path: '/admin/dashboard/blogs' },
    { icon: Video, label: 'Videos', path: '/admin/dashboard/videos' },
    { icon: Download, label: 'Resources', path: '/admin/dashboard/resources' },
    { icon: Star, label: 'Testimonials', path: '/admin/dashboard/testimonials' },
    { icon: MessageSquare, label: 'FAQs', path: '/admin/dashboard/faqs' },
    { icon: BookOpen, label: 'Knowledge Base', path: '/admin/dashboard/kb' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-mark">TB</div>
            <span className="brand-text">TaxBridge</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            {sidebarOpen && (
              <>
                <div className="user-avatar">{user?.user_id?.charAt(0) || 'A'}</div>
                <div className="user-details">
                  <div className="user-name">{user?.user_id || 'Admin'}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="videos" element={<VideoManager />} />
          <Route path="resources" element={<ResourceManager />} />
          <Route path="testimonials" element={<TestimonialManager />} />
          <Route path="faqs" element={<FAQManager />} />
          <Route path="kb" element={<KBManager />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
