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
        const result = await res.json();
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
              <Spinner />
            </div>
          ) : (
            <Row>
              {blogPosts.map(post => (
                <Col lg={4} md={6} key={post._id} className="mb-4">
                  <Card className="blog-card h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={`${API_URL}${post.image}`}
                      className="blog-card-img"
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title as="h3">{post.title}</Card.Title>

                      <div className="blog-meta text-muted mb-3">
                        Posted on {new Date(post.createdAt).toDateString()}
                        {post.author?.username && ` by ${post.author.username}`}
                      </div>

                      <Card.Text>
                        {post.content.substring(0, 120)}...
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
