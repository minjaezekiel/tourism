import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL;

const GalleryTab = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState({ alt: '', image: null });

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/gallery`);
      const text = await res.text();
      const data = JSON.parse(text);
      
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      
      setGalleryImages(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddImage = async () => {
    if (!newImage.alt || !newImage.image) {
      alert("Alt text and Image are required.");
      return;
    }

    const formData = new FormData();
    formData.append('alt', newImage.alt);
    formData.append('image', newImage.image);

    try {
      const res = await fetch(`${API_URL}/gallery`, { 
        method: 'POST', 
        body: formData,
        headers: getAuthHeaders()
      });
      
      const text = await res.text();
      const data = JSON.parse(text);
      
      if (!res.ok) throw new Error(data.message || 'Failed to add image');

      setNewImage({ alt: '', image: null });
      setShowModal(false);
      fetchGallery(); 
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Failed to add gallery image:', err);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      const res = await fetch(`${API_URL}/gallery/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const text = await res.text();
      const data = JSON.parse(text);
      
      if (!res.ok) throw new Error(data.message || 'Failed to delete');
      
      fetchGallery(); 
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Failed to delete gallery image:', err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Gallery Management</h4>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Image
            </Button>
          </div>

          {galleryImages.length === 0 ? (
            <p className="text-center text-muted py-5">No gallery images found. Add your first image!</p>
          ) : (
            <Row>
              {galleryImages.map(image => (
                <Col md={4} key={image.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    {/* FIX: Changed image.image to image.src to match your backend! */}
                    <Card.Img 
                      variant="top" 
                      src={`${API_URL}${image.src}`} 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <p className="mb-2 fw-bold">{image.alt}</p>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteImage(image.id)}>
                        <FontAwesomeIcon icon={faTrash} className="me-1" />
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Add Image Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Gallery Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Image Alt Text</Form.Label>
              <Form.Control
                type="text"
                value={newImage.alt}
                onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                placeholder="e.g., Sunset in Zanzibar"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage({ ...newImage, image: e.target.files[0] })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddImage}>
            Add Image
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GalleryTab;