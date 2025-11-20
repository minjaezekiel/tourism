import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Modal component for viewing full blog posts with like and testimonial functionality
 */
const BlogPostModal = ({ show, handleClose, blogPost }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [testimonial, setTestimonial] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);
  const [testimonialError, setTestimonialError] = useState('');

  const handleLike = () => {
    if (!liked) {
      setLikesCount(likesCount + 1);
      setLiked(true);
    } else {
      setLikesCount(likesCount - 1);
      setLiked(false);
    }
  };

  const handleTestimonialChange = (e) => {
    const { name, value } = e.target;
    setTestimonial({
      ...testimonial,
      [name]: value
    });
  };

  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    setTestimonialError('');

    if (!testimonial.name || !testimonial.email || !testimonial.message) {
      setTestimonialError('Please fill in all fields');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setTestimonialSubmitted(true);
      setTestimonial({ name: '', email: '', message: '' });
      setTimeout(() => {
        setTestimonialSubmitted(false);
      }, 3000);
    }, 500);
  };

  if (!blogPost) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{blogPost.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="blog-post-content">
          <img src={blogPost.image} alt={blogPost.title} className="img-fluid rounded mb-3" />
          
          <div className="blog-meta text-muted mb-3">
            Posted on {blogPost.date} by {blogPost.author}
          </div>

          <div className="blog-text mb-4">
            {blogPost.content || blogPost.excerpt}
          </div>

          {/* Like Section */}
          <div className="like-section mb-4 p-3 bg-light rounded">
            <Button
              variant={liked ? "danger" : "outline-danger"}
              onClick={handleLike}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faHeart} className="me-2" />
              {liked ? 'Liked' : 'Like'} ({likesCount})
            </Button>
          </div>

          {/* Testimonial Section */}
          <div className="testimonial-section">
            <h5 className="mb-3">Leave a Testimonial</h5>
            
            {testimonialSubmitted && (
              <Alert variant="success" className="mb-3">
                Thank you for your testimonial! It has been submitted successfully.
              </Alert>
            )}

            {testimonialError && (
              <Alert variant="danger" className="mb-3">
                {testimonialError}
              </Alert>
            )}

            <Form onSubmit={handleTestimonialSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={testimonial.name}
                  onChange={handleTestimonialChange}
                  placeholder="Enter your name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={testimonial.email}
                  onChange={handleTestimonialChange}
                  placeholder="Enter your email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Your Testimonial</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  value={testimonial.message}
                  onChange={handleTestimonialChange}
                  placeholder="Share your thoughts about this blog post..."
                />
              </Form.Group>

              <Button type="submit" variant="primary">
                Submit Testimonial
              </Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlogPostModal;