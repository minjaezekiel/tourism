import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Table, Nav, Tab, Spinner, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faImages,
  faBlog,
  faSignOutAlt,
  faPlus,
  faTrash,
  faEdit,
  faDesktop,
  faMobileAlt,
  faTabletAlt,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');

  // ================= Analytics =================
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  // ================= Gallery =================
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState({ alt: '', image: null });

  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const res = await fetch('http://127.0.0.1:3000/gallery');
      const data = await res.json();
      setGalleryImages(Array.isArray(data) ? data.map(img => ({ ...img, id: img._id })) : []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleAddGalleryImage = async () => {
    if (!newGalleryImage.alt || !newGalleryImage.image) return;

    const formData = new FormData();
    formData.append('alt', newGalleryImage.alt);
    formData.append('image', newGalleryImage.image);

    try {
      const res = await fetch('http://127.0.0.1:3000/gallery', { method: 'POST', body: formData });
      const savedImage = await res.json();
      setGalleryImages([...galleryImages, { ...savedImage, id: savedImage._id }]);
      setNewGalleryImage({ alt: '', image: null });
      setShowGalleryModal(false);
    } catch (err) {
      console.error('Failed to add gallery image:', err);
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    try {
      await fetch(`http://127.0.0.1:3000/gallery/${id}`, { method: 'DELETE' });
      setGalleryImages(galleryImages.filter(img => img.id !== id));
    } catch (err) {
      console.error('Failed to delete gallery image:', err);
    }
  };

  // ================= Blog =================
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [newBlogPost, setNewBlogPost] = useState({ title: '', content: '', image: null });

  const fetchBlogPosts = async () => {
    setLoadingBlog(true);
    try {
      const res = await fetch('http://127.0.0.1:3000/blog');
      const data = await res.json();
      setBlogPosts(data.data);
    } catch (err) {
      console.error('Failed to fetch blog posts', err);
    } finally {
      setLoadingBlog(false);
    }
  };

  useEffect(() => { fetchBlogPosts(); }, []);

  const handleAddOrUpdateBlogPost = async () => {
    const formData = new FormData();
    formData.append('title', newBlogPost.title);
    formData.append('content', newBlogPost.content);
    if (newBlogPost.image) formData.append('image', newBlogPost.image);

    try {
      if (editingBlog) {
        await fetch(`http://127.0.0.1:3000/blog/${editingBlog._id}`, { method: 'PUT', body: formData });
      } else {
        await fetch('http://127.0.0.1:3000/blog', { method: 'POST', body: formData });
      }
      setNewBlogPost({ title: '', content: '', image: null });
      setEditingBlog(null);
      setShowBlogModal(false);
      fetchBlogPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlogPost = async (id) => {
    try {
      await fetch(`http://127.0.0.1:3000/blog/${id}`, { method: 'DELETE' });
      fetchBlogPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditBlogPost = (post) => {
    setEditingBlog(post);
    setNewBlogPost({ title: post.title, content: post.content, image: null });
    setShowBlogModal(true);
  };
// ================= Tours =================
const API_URL = "http://127.0.0.1:3000/tours";

const [tours, setTours] = useState([]);
const [loadingTours, setLoadingTours] = useState(true);
const [showTourModal, setShowTourModal] = useState(false);
const [editingTour, setEditingTour] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [newTour, setNewTour] = useState({ title: '', description: '', price: '', link: '', image: null });

const abortRef = useRef(null);

  /* ======================
     FETCH TOURS (SAFE)
  ====================== */
  const fetchTours = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingTours(true);

    try {
      const res = await fetch(API_URL, { signal: controller.signal });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      setTours(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch tours:", err);
        setTours([]);
      }
    } finally {
      setLoadingTours(false);
    }
  };

  useEffect(() => {
    fetchTours();
    return () => abortRef.current?.abort();
  }, []);


useEffect(() => {
  const controller = new AbortController();
  fetchTours(controller.signal);

  return () => controller.abort();
}, []);

/* ======================
     ADD / UPDATE TOUR
  ====================== */
  const handleAddOrUpdateTour = async () => {
    if (isSubmitting) return;

    if (!newTour.title || !newTour.description || !newTour.price || !newTour.link) {
      alert("All fields are required");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", newTour.title);
    formData.append("description", newTour.description);
    formData.append("price", newTour.price);
    formData.append("link", newTour.link);
    if (newTour.image) formData.append("image", newTour.image);

    try {
      const url = editingTour
        ? `${API_URL}/${editingTour._id}`
        : API_URL;

      const method = editingTour ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      await fetchTours();

      setNewTour({
        title: "",
        description: "",
        price: "",
        link: "",
        image: null
      });

      setEditingTour(null);
      setShowTourModal(false);
    } catch (err) {
      console.error("Failed to add/update tour:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

/* ======================
     DELETE TOUR
  ====================== */
  const handleDeleteTour = async (id) => {
    if (!window.confirm("Delete this tour?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      fetchTours();
    } catch (err) {
      console.error("Failed to delete tour:", err);
    }
  };

 /* ======================
     EDIT TOUR
  ====================== */
  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setNewTour({
      title: tour.title,
      description: tour.description,
      price: tour.price,
      link: tour.link,
      image: null
    });
    setShowTourModal(true);
  };



  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-white shadow-sm py-3 mb-4">
        <Container fluid>
          <Row>
            <Col><h4 className="text-primary">Admin Dashboard</h4></Col>
            <Col className="text-end">
              <Button variant="outline-danger" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Row>
            <Col md={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item><Nav.Link eventKey="analytics"><FontAwesomeIcon icon={faChartBar} /> Analytics</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="gallery"><FontAwesomeIcon icon={faImages} /> Gallery</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="blog"><FontAwesomeIcon icon={faBlog} /> Blog</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="tours"><FontAwesomeIcon icon={faGlobe} /> Tours</Nav.Link></Nav.Item>
              </Nav>
            </Col>

            <Col md={9}>
              <Tab.Content>

                {/* =============== Analytics =============== */}
                <Tab.Pane eventKey="analytics">
                  <Card>
                    <Card.Body>
                      <h5>Site Analytics</h5>
                      {loadingAnalytics ? <Spinner /> : (
                        <>
                          <h2>{analytics.totalVisitors.toLocaleString()} Visitors</h2>
                          <Row className="mt-4">
                            <Col><FontAwesomeIcon icon={faDesktop} /> {analytics.deviceStats.desktop}</Col>
                            <Col><FontAwesomeIcon icon={faMobileAlt} /> {analytics.deviceStats.mobile}</Col>
                            <Col><FontAwesomeIcon icon={faTabletAlt} /> {analytics.deviceStats.tablet}</Col>
                          </Row>
                          <Table className="mt-4" bordered>
                            <thead><tr><th>Country</th><th>Visitors</th></tr></thead>
                            <tbody>
                              {analytics.countryStats.map((c, i) => (
                                <tr key={i}>
                                  <td><FontAwesomeIcon icon={faGlobe} /> {c.country}</td>
                                  <td>{c.visitors}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* =============== Gallery =============== */}
                <Tab.Pane eventKey="gallery">
                  <Button className="mb-3" onClick={() => setShowGalleryModal(true)}>
                    <FontAwesomeIcon icon={faPlus} /> Add Image
                  </Button>
                  {loadingGallery ? <Spinner /> : (
                    <Row>
                      {galleryImages.map(img => (
                        <Col md={4} key={img.id} className="mb-3">
                          <Card>
                            <Card.Img src={`http://127.0.0.1:3000${img.src}`} />
                            <Card.Body>
                              <p>{img.alt}</p>
                              <Button size="sm" variant="danger" onClick={() => handleDeleteGalleryImage(img.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Tab.Pane>

                {/* =============== Blog =============== */}
                <Tab.Pane eventKey="blog">
                  <Button className="mb-3" onClick={() => setShowBlogModal(true)}>
                    <FontAwesomeIcon icon={faPlus} /> {editingBlog ? "Edit Post" : "Add Post"}
                  </Button>
                  {loadingBlog ? <Spinner /> : (
                    <Table className="mt-3">
                      <tbody>
                        {blogPosts.map(p => (
                          <tr key={p._id}>
                            <td>{p.title}</td>
                            <td>
                              <Button size="sm" onClick={() => handleEditBlogPost(p)}><FontAwesomeIcon icon={faEdit} /></Button>
                              <Button size="sm" variant="danger" onClick={() => handleDeleteBlogPost(p._id)}><FontAwesomeIcon icon={faTrash} /></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab.Pane>

                {/* =============== Tours =============== */}
                <Tab.Pane eventKey="tours">
                  <Button className="mb-3" onClick={() => setShowTourModal(true)}>
                    <FontAwesomeIcon icon={faPlus} /> {editingTour ? "Edit Tour" : "Add Tour"}
                  </Button>
                  {loadingTours ? <Spinner /> : (
                    <Table className="mt-3">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Price</th>
                          <th>Link</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tours.map(t => (
                          <tr key={t._id}>
                            <td>{t.title}</td>
                            <td>{t.price}</td>
                            <td><a href={t.link} target="_blank" rel="noreferrer">{t.link}</a></td>
                            <td>
                              <Button size="sm" onClick={() => handleEditTour(t)}><FontAwesomeIcon icon={faEdit} /></Button>
                              <Button size="sm" variant="danger" onClick={() => handleDeleteTour(t._id)}><FontAwesomeIcon icon={faTrash} /></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab.Pane>

              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      {/* ================= Modals ================= */}
      {/* Gallery Modal */}
      <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Gallery Image</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Alt Text</Form.Label>
              <Form.Control
                type="text"
                value={newGalleryImage.alt}
                onChange={(e) => setNewGalleryImage({ ...newGalleryImage, alt: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewGalleryImage({ ...newGalleryImage, image: e.target.files[0] })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGalleryModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddGalleryImage}>Add Image</Button>
        </Modal.Footer>
      </Modal>

      {/* Blog Modal */}
      <Modal show={showBlogModal} onHide={() => { setShowBlogModal(false); setEditingBlog(null); }}>
        <Modal.Header closeButton><Modal.Title>{editingBlog ? "Edit Blog Post" : "Add Blog Post"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newBlogPost.title}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={newBlogPost.content}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewBlogPost({ ...newBlogPost, image: e.target.files[0] })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowBlogModal(false); setEditingBlog(null); }}>Cancel</Button>
          <Button variant="primary" onClick={handleAddOrUpdateBlogPost}>{editingBlog ? "Update Post" : "Add Post"}</Button>
        </Modal.Footer>
      </Modal>

      {/* Tours Modal */}
<Modal
  show={showTourModal}
  onHide={() => {
    setShowTourModal(false);
    setEditingTour(null);
  }}
>
  <Modal.Header closeButton>
    <Modal.Title>{editingTour ? "Edit Tour" : "Add Tour"}</Modal.Title>
  </Modal.Header>

  <Form
    onSubmit={(e) => {
      e.preventDefault(); // 🔥 CRITICAL FIX
      handleAddOrUpdateTour();
    }}
  >
    <Modal.Body>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={newTour.title}
          onChange={(e) =>
            setNewTour({ ...newTour, title: e.target.value })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={newTour.description}
          onChange={(e) =>
            setNewTour({ ...newTour, description: e.target.value })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="text"
          value={newTour.price}
          onChange={(e) =>
            setNewTour({ ...newTour, price: e.target.value })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Link</Form.Label>
        <Form.Control
          type="url"
          value={newTour.link}
          onChange={(e) =>
            setNewTour({ ...newTour, link: e.target.value })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewTour({ ...newTour, image: e.target.files[0] })
          }
        />
      </Form.Group>
    </Modal.Body>

    <Modal.Footer>
      <Button
        variant="secondary"
        type="button"
        onClick={() => {
          setShowTourModal(false);
          setEditingTour(null);
        }}
      >
        Cancel
      </Button>

      <Button
        variant="primary"
        type="submit" // ✅ SAFE NOW
        disabled={isSubmitting}
      >
        {editingTour ? "Update Tour" : "Add Tour"}
      </Button>
    </Modal.Footer>
  </Form>
</Modal>
</div>
);
};

export default AdminDashboard;
