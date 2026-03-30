import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL;

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${API_URL}/gallery`);
        const text = await res.text();
        const result = JSON.parse(text);

        if (!res.ok) {
          throw new Error(result.message || 'Failed to fetch gallery');
        }

        // FIX: Backend sends { success: true, data: [...] }
        if (result.data && Array.isArray(result.data)) {
          setGalleryImages(result.data);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load gallery images.');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="section-padding">
      <Container>
        <div className="text-center mb-5">
          <h2>Gallery</h2>
          <p className="lead">Glimpses of unforgettable Tanzanian adventures</p>
        </div>

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        {!loading && !error && galleryImages.length === 0 && (
          <p className="text-center text-muted">
            No gallery images available yet.
          </p>
        )}

        <Row>
          {galleryImages.map((image) => (
            // FIX: Use image.id (Sequelize) instead of image._id (MongoDB)
            <Col lg={4} md={6} key={image.id} className="mb-4">
              <div className="gallery-item overflow-hidden rounded shadow-sm h-100">
                {/* FIX: Use image.src to match your backend controller */}
                <img
                  src={`${API_URL}${image.src}`}
                  alt={image.alt || 'Tanzania Gallery'}
                  className="img-fluid gallery-img w-100"
                  style={{ 
                    height: '300px', 
                    objectFit: 'cover', 
                    transition: 'transform 0.3s ease' 
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  loading="lazy"
                />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Gallery;