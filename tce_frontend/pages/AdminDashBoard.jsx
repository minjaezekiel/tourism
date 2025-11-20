import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Table, Nav, Tab } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faImages,
  faBlog,
  faSignOutAlt,
  faPlus,
  faTrash,
  faEdit,
  faEye,
  faDesktop,
  faMobileAlt,
  faTabletAlt,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

/**
 * Admin dashboard component with analytics, gallery, and blog management
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Mock data states
  const [galleryImages, setGalleryImages] = useState([
    { id: 1, alt: "Lion in Serengeti", src: "https://picsum.photos/seed/wildlife-lion/400/250.jpg" },
    { id: 2, alt: "Elephant Family", src: "https://picsum.photos/seed/elephant-family/400/250.jpg" },
    { id: 3, alt: "Safari Sunset", src: "https://picsum.photos/seed/sunset-safari/400/250.jpg" }
  ]);

  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Best Time to Visit Tanzania for Safari",
      excerpt: "Planning your Tanzanian safari? Learn about the different seasons...",
      content: "Full content here...",
      date: "June 15, 2023",
      author: "Admin",
      image: "https://picsum.photos/seed/blog-best-time/400/200.jpg"
    },
    {
      id: 2,
      title: "Essential Packing List for Your Tanzania Safari",
      excerpt: "Wondering what to pack for your Tanzanian adventure?...",
      content: "Full content here...",
      date: "May 28, 2023",
      author: "Admin",
      image: "https://picsum.photos/seed/blog-packing/400/200.jpg"
    }
  ]);

  const [analytics, setAnalytics] = useState({
    totalVisitors: 15234,
    deviceStats: {
      desktop: 6543,
      mobile: 7234,
      tablet: 1457
    },
    countryStats: [
      { country: "United States", visitors: 5432 },
      { country: "United Kingdom", visitors: 3211 },
      { country: "Germany", visitors: 2876 },
      { country: "France", visitors: 1987 },
      { country: "Canada", visitors: 1728 }
    ]
  });

  // Forms
  const [newGalleryImage, setNewGalleryImage] = useState({
    alt: '',
    src: ''
  });

  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: ''
  });

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin-login');
  };

  // Gallery functions
  const handleAddGalleryImage = () => {
    if (newGalleryImage.alt && newGalleryImage.src) {
      const newImage = {
        id: Date.now(),
        ...newGalleryImage
      };
      setGalleryImages([...galleryImages, newImage]);
      setNewGalleryImage({ alt: '', src: '' });
      setShowAddGalleryModal(false);
    }
  };

  const handleDeleteGalleryImage = (id) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  // Blog functions
  const handleAddBlogPost = () => {
    if (newBlogPost.title && newBlogPost.excerpt && newBlogPost.content) {
      const newPost = {
        id: Date.now(),
        ...newBlogPost,
        date: new Date().toLocaleDateString(),
        author: "Admin"
      };
      setBlogPosts([...blogPosts, newPost]);
      setNewBlogPost({ title: '', excerpt: '', content: '', image: '' });
      setShowAddBlogModal(false);
    }
  };

  const handleEditBlogPost = (post) => {
    setEditingBlog(post);
    setNewBlogPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image
    });
    setShowAddBlogModal(true);
  };

  const handleUpdateBlogPost = () => {
    if (editingBlog && newBlogPost.title && newBlogPost.excerpt && newBlogPost.content) {
      const updatedPosts = blogPosts.map(post =>
        post.id === editingBlog.id
          ? { ...post, ...newBlogPost }
          : post
      );
      setBlogPosts(updatedPosts);
      setEditingBlog(null);
      setNewBlogPost({ title: '', excerpt: '', content: '', image: '' });
      setShowAddBlogModal(false);
    }
  };

  const handleDeleteBlogPost = (id) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
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
                  </Nav>
                </Card.Body>
              </Card>
            </Col>

            {/* Content */}
            <Col md={9}>
              <Tab.Content>
                {/* Analytics Tab */}
                <Tab.Pane eventKey="analytics">
                  <Card className="shadow-sm mb-4">
                    <Card.Body>
                      <h4 className="mb-4">Site Analytics</h4>
                      
                      <Row className="mb-4">
                        <Col md={4}>
                          <Card className="text-center border-primary">
                            <Card.Body>
                              <h2 className="text-primary mb-0">{analytics.totalVisitors.toLocaleString()}</h2>
                              <p className="text-muted mb-0">Total Visitors</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <h5 className="mb-3">Visitors by Device</h5>
                      <Row className="mb-4">
                        <Col md={4}>
                          <Card className="text-center">
                            <Card.Body>
                              <FontAwesomeIcon icon={faDesktop} size="2x" className="text-primary mb-2" />
                              <h4>{analytics.deviceStats.desktop.toLocaleString()}</h4>
                              <p className="text-muted mb-0">Desktop</p>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="text-center">
                            <Card.Body>
                              <FontAwesomeIcon icon={faMobileAlt} size="2x" className="success mb-2" style={{ color: '#28a745' }} />
                              <h4>{analytics.deviceStats.mobile.toLocaleString()}</h4>
                              <p className="text-muted mb-0">Mobile</p>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="text-center">
                            <Card.Body>
                              <FontAwesomeIcon icon={faTabletAlt} size="2x" className="info mb-2" style={{ color: '#17a2b8' }} />
                              <h4>{analytics.deviceStats.tablet.toLocaleString()}</h4>
                              <p className="text-muted mb-0">Tablet</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <h5 className="mb-3">Visitors by Country</h5>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Country</th>
                            <th>Visitors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.countryStats.map((stat, index) => (
                            <tr key={index}>
                              <td>
                                <FontAwesomeIcon icon={faGlobe} className="me-2" />
                                {stat.country}
                              </td>
                              <td>{stat.visitors.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Gallery Tab */}
                <Tab.Pane eventKey="gallery">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Gallery Management</h4>
                        <Button variant="primary" onClick={() => setShowAddGalleryModal(true)}>
                          <FontAwesomeIcon icon={faPlus} className="me-2" />
                          Add Image
                        </Button>
                      </div>

                      <Row>
                        {galleryImages.map(image => (
                          <Col md={4} key={image.id} className="mb-3">
                            <Card>
                              <Card.Img variant="top" src={image.src} />
                              <Card.Body>
                                <p className="mb-2">{image.alt}</p>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteGalleryImage(image.id)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-1" />
                                  Delete
                                </Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Blog Tab */}
                <Tab.Pane eventKey="blog">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Blog Management</h4>
                        <Button variant="primary" onClick={() => {
                          setEditingBlog(null);
                          setNewBlogPost({ title: '', excerpt: '', content: '', image: '' });
                          setShowAddBlogModal(true);
                        }}>
                          <FontAwesomeIcon icon={faPlus} className="me-2" />
                          Add Post
                        </Button>
                      </div>

                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Author</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogPosts.map(post => (
                            <tr key={post.id}>
                              <td>{post.title}</td>
                              <td>{post.date}</td>
                              <td>{post.author}</td>
                              <td>
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditBlogPost(post)}>
                                  <FontAwesomeIcon icon={faEdit} className="me-1" />
                                  Edit
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBlogPost(post.id)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-1" />
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      {/* Add Gallery Image Modal */}
      <Modal show={showAddGalleryModal} onHide={() => setShowAddGalleryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Gallery Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Image Alt Text</Form.Label>
              <Form.Control
                type="text"
                value={newGalleryImage.alt}
                onChange={(e) => setNewGalleryImage({ ...newGalleryImage, alt: e.target.value })}
                placeholder="Enter image description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={newGalleryImage.src}
                onChange={(e) => setNewGalleryImage({ ...newGalleryImage, src: e.target.value })}
                placeholder="Enter image URL"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddGalleryModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddGalleryImage}>
            Add Image
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Blog Post Modal */}
      <Modal show={showAddBlogModal} onHide={() => setShowAddBlogModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newBlogPost.title}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                placeholder="Enter blog title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newBlogPost.excerpt}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                placeholder="Enter short excerpt"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={newBlogPost.content}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                placeholder="Enter full blog content"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={newBlogPost.image}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, image: e.target.value })}
                placeholder="Enter image URL"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddBlogModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={editingBlog ? handleUpdateBlogPost : handleAddBlogPost}>
            {editingBlog ? 'Update Post' : 'Add Post'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;