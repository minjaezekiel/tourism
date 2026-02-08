import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faClock 
} from '@fortawesome/free-solid-svg-icons';
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Contact section component with contact form and information
 */
const Contact = () => {
  // State for form submission status
  const [isLoading, setIsLoading] = useState(false); // New: Loading state
  const [error, setError] = useState(null); // New: Error state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tour: '',
    message: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
// Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors
    setFormSubmitted(false); // Clear previous success message

    try {
      const response = await fetch(`${API_URL}/contactUs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If server responds with an error (e.g., 400, 500)
        throw new Error(data.message || 'Something went wrong.');
      }

      // On success
      console.log('Server Response:', data);
      setFormSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        tour: '',
        message: ''
      });

    } catch (err) {
      // Catch network errors or errors thrown from the block above
      console.error('Submission Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <Container>
        <div className="text-center mb-5">
          <h2>Contact Us</h2>
          <p className="lead">Get in touch to plan your Tanzanian adventure</p>
        </div>
        
      {/* --- FEEDBACK MESSAGES --- */}
      {formSubmitted && (
          <Alert variant="success" className="mb-4">
            Thank you for your message! We'll get back to you soon.
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        <Row>
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="contact-form bg-white p-4 rounded shadow-sm">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="tour">
                  <Form.Label>Interested Tour</Form.Label>
                  <Form.Select 
                    name="tour"
                    value={formData.tour}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a tour</option>
                    <option value="serengeti">Serengeti Safari Adventure</option>
                    <option value="kilimanjaro">Mount Kilimanjaro Trek</option>
                    <option value="zanzibar">Zanzibar Beach Holiday</option>
                    <option value="maasai">Maasai Cultural Experience</option>
                    <option value="ngorongoro">Ngorongoro Crater Tour</option>
                    <option value="tarangire">Tarangire National Park</option>
                    <option value="custom">Custom Tour</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required 
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="contact-info p-4">
              <h3>Get in Touch</h3>
              <p>
                We're here to help you plan the perfect Tanzanian adventure. Reach out to us with any questions or to start customizing your trip.
              </p>
              
              <div className="contact-info-item d-flex align-items-center mb-4">
                <div className="icon-box me-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary fs-4" />
                </div>
                <div>
                  <h5>Address</h5>
                  <p>Arusha, Tanzania</p>
                </div>
              </div>
              
              <div className="contact-info-item d-flex align-items-center mb-4">
                <div className="icon-box me-3">
                  <FontAwesomeIcon icon={faPhone} className="text-primary fs-4" />
                </div>
                <div>
                  <h5>Phone</h5>
                  <p>+255 623 660 096</p>
                </div>
              </div>
              
              <div className="contact-info-item d-flex align-items-center mb-4">
                <div className="icon-box me-3">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary fs-4" />
                </div>
                <div>
                  <h5>Email</h5>
                  <p>info@tanzaniacorridorsexplorers.com</p>
                </div>
              </div>
              
              <div className="contact-info-item d-flex align-items-center">
                <div className="icon-box me-3">
                  <FontAwesomeIcon icon={faClock} className="text-primary fs-4" />
                </div>
                <div>
                  <h5>Business Hours</h5>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday - Sunday: 9:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Google Map */}
        <Row className="mt-5">
          <Col>
            <div className="map-container rounded overflow-hidden shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5346772265945!2d36.68295651475616!3d-3.386923997551843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1837095e3c0c2d9b%3A0x4030a5a9b4c0b5!2sArusha%2C%20Tanzania!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s" 
                width="100%" 
                height="400" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Tanzania Corridors Explorers Location"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;