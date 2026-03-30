import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import BlogPostModal from './BlogPostModal';

const API_URL = import.meta.env.VITE_API_URL;

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ================= FETCH POSTS =================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/blog`);
        const text = await res.text(); // Safe fetch
        const result = JSON.parse(text);
        setBlogPosts(result.data || []);
      } catch (error) {
        console.error('Failed to fetch blog posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleReadMore = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  // ================= SAFE HELPERS =================
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    // Check if the date is valid
    return isNaN(date.getTime()) ? "Recent" : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorName = (author) => {
    if (!author) return "Admin";
    const fullName = `${author.first_name || ''} ${author.last_name || ''}`.trim();
    return fullName || author.username || "Admin";
  };

  return (
    <>
      <section id="blog" className="section-padding">
        <Container>
          <div className="text-center mb-5">
            <h2>Travel Blog</h2>
            <p className="lead">Travel tips and stories from Tanzania</p>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : blogPosts.length === 0 ? (
            <p className="text-center text-muted">No blog posts available yet.</p>
          ) : (
            <Row>
              {blogPosts.map(post => (
                <Col lg={4} md={6} key={post.id} className="mb-4"> {/* Changed _id to id */}
                  <Card className="blog-card h-100 shadow-sm">
                    
                    {/* Only show image if it exists */}
                    {post.image && (
                      <Card.Img
                        variant="top"
                        src={`${API_URL}${post.image}`}
                        className="blog-card-img"
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                    )}

                    <Card.Body className="d-flex flex-column">
                      <Card.Title as="h3">{post.title}</Card.Title>

                      <div className="blog-meta text-muted mb-3">
                        Posted on {formatDate(post.created_at || post.createdAt)} by {getAuthorName(post.author)}
                      </div>

                      <Card.Text>
                        {post.content ? `${post.content.substring(0, 120)}...` : 'Click read more to view the full post.'}
                      </Card.Text>

                      <div className="mt-auto">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleReadMore(post)}
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      <BlogPostModal
        show={showModal}
        handleClose={handleCloseModal}
        blogPost={selectedPost}
      />
    </>
  );
};

export default Blog;