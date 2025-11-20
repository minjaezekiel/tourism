import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import BlogPostModal from './BlogPostModal';

/**
 * Blog section component displaying travel tips and stories
 */
const Blog = () => {
  // Blog posts data array for easier management
  const blogPosts = [
    {
      id: 1,
      title: "Best Time to Visit Tanzania for Safari",
      excerpt: "Planning your Tanzanian safari? Learn about the different seasons and when to visit for the best wildlife viewing opportunities.",
      content: "Tanzania is a year-round safari destination, but the best time to visit depends on what you want to see. The dry season from June to October is ideal for wildlife viewing as animals gather around water sources. The Great Migration in the Serengeti typically occurs from July to October. The wet season from November to May offers lush landscapes, fewer crowds, and excellent bird watching opportunities.",
      date: "June 15, 2023",
      author: "Admin",
      image: "https://picsum.photos/seed/blog-best-time/400/200.jpg"
    },
    {
      id: 2,
      title: "Essential Packing List for Your Tanzania Safari",
      excerpt: "Wondering what to pack for your Tanzanian adventure? Check out our comprehensive packing guide to ensure you're prepared for everything.",
      content: "Packing for a Tanzania safari requires careful consideration. Essential items include lightweight, neutral-colored clothing, a good pair of binoculars, sunscreen, insect repellent, a hat, comfortable walking shoes, and a camera with extra batteries. Don't forget to pack layers for temperature changes and a waterproof jacket for unexpected rain. Remember to bring any necessary medications and a small first aid kit.",
      date: "May 28, 2023",
      author: "Admin",
      image: "https://picsum.photos/seed/blog-packing/400/200.jpg"
    },
    {
      id: 3,
      title: "Authentic Cultural Experiences in Tanzania",
      excerpt: "Discover the rich cultural heritage of Tanzania through these immersive experiences that connect you with local communities and traditions.",
      content: "Tanzania offers incredible cultural experiences beyond wildlife safaris. Visit a Maasai village to learn about their traditional way of life, participate in a coffee tour on the slopes of Mount Meru, explore the ancient rock paintings at Kondoa, or visit a local market in Arusha. These experiences provide insight into Tanzania's diverse cultures and support local communities directly.",
      date: "May 10, 2023",
      author: "Admin",
      image: "https://picsum.photos/seed/blog-cultural/400/200.jpg"
    }
  ];

  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
          <Row>
            {blogPosts.map(post => (
              <Col lg={4} md={6} key={post.id} className="mb-4">
                <Card className="blog-card h-100 shadow-sm">
                  <Card.Img variant="top" src={post.image} className="blog-card-img" />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title as="h3">{post.title}</Card.Title>
                    <div className="blog-meta text-muted mb-3">
                      Posted on {post.date} by {post.author}
                    </div>
                    <Card.Text>{post.excerpt}</Card.Text>
                    <div className="mt-auto">
                      <Button variant="outline-primary" onClick={() => handleReadMore(post)} className="read-more-btn">
                        Read More
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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