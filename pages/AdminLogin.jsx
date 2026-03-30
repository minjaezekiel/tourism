import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const navigate = useNavigate();

  // ✅ FIXED: Changed 'email' to 'username'
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        formData // Now sends { username: "...", password: "..." }
      );

      const { token } = response.data;

      // Save token
      localStorage.setItem('token', token);

      // Decode token
      const decoded = jwtDecode(token);

      // Redirect based on role
      if (decoded.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard'); // normal users
      }

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-login-page min-vh-100 d-flex align-items-center"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card className="shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Admin Login</h2>
                  <p className="text-muted">Tanzania Corridors Explorers</p>
                </div>

                {error && (
                  <Alert variant="danger">
                    {error.length > 100 ? error.slice(0, 100) + '...' : error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* ✅ FIXED: Username Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text" // Changed from "email" to "text"
                      name="username" // Changed from "email" to "username"
                      value={formData.username} // Changed from formData.email
                      onChange={handleChange}
                      placeholder="Enter username"
                      required
                    />
                  </Form.Group>

                  {/* Password Field (Unchanged) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                    <Form.Check
                      type="checkbox"
                      label="Show Password"
                      className="mt-2"
                      onChange={() => setShowPassword(prev => !prev)}
                    />
                  </Form.Group>

                  {/* Submit Button (Unchanged) */}
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
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