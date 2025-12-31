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
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

// Import tab components
import AnalyticsTab from './adminComponents/AnalyticsTab';
import GalleryTab from './adminComponents/GalleryTab';
import BlogTab from './adminComponents/BlogTab';
import ToursTab from './adminComponents/ToursTab';
import ContactTab from './adminComponents/ContactTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3000/api/analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics');
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <div className="admin-dashboard min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="admin-header bg-white shadow-sm py-3 mb-4">
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-primary">Admin Dashboard</h3>
            </Col>
            <Col className="text-end">
              <Button variant="outline-danger" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Logout
              </Button>
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
                {/* Analytics Tab */}
                <Tab.Pane eventKey="analytics">
                  <AnalyticsTab loading={loadingAnalytics} analytics={analytics} />
                </Tab.Pane>

                {/* Gallery Tab */}
                <Tab.Pane eventKey="gallery">
                  <GalleryTab />
                </Tab.Pane>

                {/* Blog Tab */}
                <Tab.Pane eventKey="blog">
                  <BlogTab />
                </Tab.Pane>

                {/* Tours Tab */}
                <Tab.Pane eventKey="tours">
                  <ToursTab />
                </Tab.Pane>

                {/* Contact Tab */}
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