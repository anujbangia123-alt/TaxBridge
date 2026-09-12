import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, FolderOpen, Globe, Calendar, Scale, ArrowRight } from 'lucide-react';
import axios from 'axios';
import './KnowledgeBase.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const KnowledgeBase = () => {
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  const fetchKnowledgeBase = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/public/kb-categories`);
      setKnowledgeBase(response.data);
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      BookOpen: <BookOpen size={28} />,
      FileText: <FileText size={28} />,
      FolderOpen: <FolderOpen size={28} />,
      Globe: <Globe size={28} />,
      Calendar: <Calendar size={28} />,
      Scale: <Scale size={28} />
    };
    return icons[iconName] || <BookOpen size={28} />;
  };

  if (loading) {
    return (
      <section id="knowledge-base" className="knowledge-section">
        <div className="section-head">
          <h2>Knowledge Base</h2>
          <div className="section-num">08 / Documentation</div>
        </div>
        <div style={{padding: '40px', textAlign: 'center', color: 'var(--ink-soft)'}}>
          Loading knowledge base...
        </div>
      </section>
    );
  }

  return (
    <section id="knowledge-base" className="knowledge-section">
      <div className="section-head">
        <h2>Knowledge Base</h2>
        <div className="section-num">08 / Documentation</div>
      </div>

      <p className="knowledge-intro">
        Comprehensive guides, documentation, and resources to help you understand transfer pricing and international tax compliance.
      </p>

      <div className="knowledge-grid">
        {knowledgeBase.map((category) => (
          <div key={category.id} className="knowledge-card">
            <div className="knowledge-icon">{getIcon(category.icon)}</div>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <ul className="article-list">
              {category.articles.map((article) => (
                <li key={article.id}>
                  <a href={`#${article.slug}`}>
                    {article.title}
                    <ArrowRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KnowledgeBase;
