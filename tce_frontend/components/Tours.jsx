import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Public Tours section
 * Fetches tour packages from backend and displays them
 */
const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`${API_URL}/tours`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        // ✅ BACKEND RETURNS { success, data }
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid tours response format");
        }

        setTours(result.data);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError("Failed to load tour packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <section id="tours" className="section-padding">
      <Container>
        {/* Section header */}
        <div className="text-center mb-5">
          <h2>Our Tour Packages</h2>
          <p className="lead">
            Discover our carefully crafted safari and cultural experiences
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {/* Tours */}
        {!loading && !error && (
          <Row>
            {tours.length > 0 ? (
              tours.map((tour) => (
                <Col lg={4} md={6} key={tour._id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={
                        tour.image
                          ? `${API_URL}${tour.image}`
                          : "/placeholder.png"
                      }
                      alt={tour.title}
                      style={{ height: "220px", objectFit: "cover" }}
                    />

                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{tour.title}</Card.Title>
                      <Card.Text className="flex-grow-1">
                        {tour.description}
                      </Card.Text>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="fw-bold fs-5">
                          ${tour.price}
                        </span>

                        <Button
                          variant="primary"
                          href={tour.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Book Now
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center text-muted">
                  No tour packages available.
                </p>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Tours;
