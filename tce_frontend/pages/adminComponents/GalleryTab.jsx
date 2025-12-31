import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const GalleryTab = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState({ alt: '', image: null });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:3000/gallery');
      const data = await res.json();
      setGalleryImages(Array.isArray(data) ? data.map(img => ({ ...img, id: img._id })) : []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddImage = async () => {
    if (!newImage.alt || !newImage.image) return;

    const formData = new FormData();
    formData.append('alt', newImage.alt);
    formData.append('image', newImage.image);

    try {
      const res = await fetch('http://127.0.0.1:3000/gallery', { method: 'POST', body: formData });
      const savedImage = await res.json();
      setGalleryImages([...galleryImages, { ...savedImage, id: savedImage._id }]);
      setNewImage({ alt: '', image: null });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add gallery image:', err);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await fetch(`http://127.0.0.1:3000/gallery/${id}`, { method: 'DELETE' });
      setGalleryImages(galleryImages.filter(img => img.id !== id));
    } catch (err) {
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
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Gallery Management</h4>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Image
            </Button>
          </div>

          <Row>
            {galleryImages.map(image => (
              <Col md={4} key={image.id} className="mb-3">
                <Card>
                  <Card.Img variant="top" src={`http://127.0.0.1:3000${image.src}`} />
                  <Card.Body>
                    <p className="mb-2">{image.alt}</p>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteImage(image.id)}>
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
                placeholder="Enter image description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewImage({ ...newImage, image: e.target.files[0] })}
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