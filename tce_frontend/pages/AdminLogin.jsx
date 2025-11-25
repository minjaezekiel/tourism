// src/components/AdminLogin.jsx (or wherever your file is)

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios

/**
 * Admin login page component
 */
const AdminLogin = () => {
  // 2. useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // 3. Updated form data to use 'email' to match the backend
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 4. Make the API call to your backend
      const response = await axios.post(`http://127.0.0.1:3000/users/login`, formData);

      // 5. On successful login, store the JWT token
      const { token } = response.data;
      localStorage.setItem('token', token); // Store token in localStorage

      // 6. Redirect to the admin dashboard
      navigate('/admin-dashboard');

    } catch (err) {
      // 7. Handle errors (e.g., invalid credentials, network error)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Display error from backend
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      // 8. Set loading to false regardless of outcome
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card className="shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Admin Login</h2>
                  <p className="text-muted">Tanzania Corridors Explorers</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {/* 9. Changed form field from username to email */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>

                  <div className="text-center">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;