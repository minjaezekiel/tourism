import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

/**
 * Forgot password page component
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (email) {
        setSubmitted(true);
      } else {
        setError('Please enter your email address');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="forgot-password-page min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card className="shadow-lg">
              <Card.Body className="p-5">
                <Link to="/admin-login" className="text-decoration-none text-muted mb-4 d-inline-block">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back to Login
                </Link>

                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Forgot Password</h2>
                  <p className="text-muted">Enter your email to reset your password</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {submitted ? (
                  <Alert variant="success">
                    <Alert.Heading>Check your email</Alert.Heading>
                    <p>
                      We've sent password reset instructions to your email address.
                    </p>
                  </Alert>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;