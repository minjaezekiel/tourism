import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

/**
 * Gallery section component
 * Fetches and renders gallery images from backend
 */
const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3000/gallery');

        if (!res.ok) {
          throw new Error('Failed to fetch gallery');
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid gallery response');
        }

        setGalleryImages(data);
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
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          {galleryImages.map(image => (
            <Col lg={4} md={6} key={image._id} className="mb-4">
              <div className="gallery-item overflow-hidden rounded shadow-sm">
                <img
                  src={`http://127.0.0.1:3000${image.src}`}
                  alt={image.alt}
                  className="img-fluid gallery-img"
                  loading="lazy"
                />
              </div>
            </Col>
          ))}
        </Row>

        {!loading && galleryImages.length === 0 && (
          <p className="text-center text-muted">
            No gallery images available.
          </p>
        )}
      </Container>
    </section>
  );
};

export default Gallery;
