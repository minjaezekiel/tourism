import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faImages,
  faBlog,
  faSignOutAlt,
  faEnvelope,
  faGlobe,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';

// Import tab components
import AnalyticsTab from './adminComponents/AnalyticsTab';
import GalleryTab from './adminComponents/GalleryTab';
import BlogTab from './adminComponents/BlogTab';
import ToursTab from './adminComponents/ToursTab';
import ContactTab from './adminComponents/ContactTab';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');

  // ==========================
  // 🌙 DAY/NIGHT MODE STATE
  // ==========================
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply theme to the root HTML element
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // ==========================
  // 🔐 AUTH & LOGOUT
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    // FIX: Use Bootstrap CSS variable so background automatically changes with Dark/Light mode
    <div className="admin-dashboard min-vh-100" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      
      {/* Header */}
      <div className="admin-header shadow-sm py-3 mb-4 border-bottom" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-primary">Admin Dashboard</h3>
            </Col>
            <Col className="text-end">
              <div className="d-flex justify-content-end gap-2">
                {/* 🌙 DARK MODE TOGGLE BUTTON */}
                <Button 
                  variant={theme === 'light' ? 'outline-secondary' : 'outline-light'} 
                  size="sm" 
                  onClick={toggleTheme}
                  className="rounded-pill px-3"
                >
                  <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="me-1" />
                  {theme === 'light' ? 'Dark' : 'Light'}
                </Button>

                <Button variant="outline-danger" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid>
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row>
            {/* Sidebar */}
            <Col md={3} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body className="p-0">
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="analytics" className="rounded-0">
                        <FontAwesomeIcon icon={faChartBar} className="me-2" />
                        Analytics
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="gallery" className="rounded-0">
                        <FontAwesomeIcon icon={faImages} className="me-2" />
                        Gallery Management
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="blog" className="rounded-0">
                        <FontAwesomeIcon icon={faBlog} className="me-2" />
                        Blog Management
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tours" className="rounded-0">
                        <FontAwesomeIcon icon={faGlobe} className="me-2" />
                        Tours Management
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="contact" className="rounded-0">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        Contact Messages
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>

            {/* Content */}
            <Col md={9}>
              <Tab.Content>
                <Tab.Pane eventKey="analytics">
                  <AnalyticsTab />
                </Tab.Pane>

                <Tab.Pane eventKey="gallery">
                  <GalleryTab />
                </Tab.Pane>

                <Tab.Pane eventKey="blog">
                  <BlogTab />
                </Tab.Pane>

                <Tab.Pane eventKey="tours">
                  <ToursTab />
                </Tab.Pane>

                <Tab.Pane eventKey="contact">
                  <ContactTab />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;