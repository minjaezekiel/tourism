import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

/**
 * Testimonials section component displaying client feedback
 */
const Testimonials = () => {
  // Testimonials data array for easier management
  const testimonials = [
    {
      id: 1,
      text: "Our safari with Tanzania Corridors Explorers was absolutely incredible! The guides were knowledgeable, the accommodations were comfortable, and we saw all the Big Five. Highly recommend!",
      author: "Sarah Johnson",
      location: "USA",
      image: "https://picsum.photos/seed/person1/60/60.jpg"
    },
    {
      id: 2,
      text: "The Kilimanjaro trek was challenging but incredibly rewarding. Our guide was supportive throughout, and reaching the summit at sunrise was a life-changing experience. Thank you!",
      author: "Michael Chen",
      location: "Canada",
      image: "https://picsum.photos/seed/person2/60/60.jpg"
    },
    {
      id: 3,
      text: "The Maasai cultural tour was the highlight of our trip to Tanzania. We learned so much about their traditions and way of life. It was authentic and respectful. A must-do experience!",
      author: "Emma Wilson",
      location: "UK",
      image: "https://picsum.photos/seed/person3/60/60.jpg"
    },
    {
      id: 4,
      text: "Zanzibar was paradise! The beaches were stunning, Stone Town was fascinating, and the spice tour was educational. Tanzania Corridors Explorers arranged everything perfectly.",
      author: "David Rodriguez",
      location: "Spain",
      image: "https://picsum.photos/seed/person4/60/60.jpg"
    },
    {
      id: 5,
      text: "As a solo traveler, I felt safe and well-cared-for throughout my safari. The group was friendly, the guide was excellent, and the wildlife sightings were beyond my expectations.",
      author: "Lisa Anderson",
      location: "Australia",
      image: "https://picsum.photos/seed/person5/60/60.jpg"
    },
    {
      id: 6,
      text: "Our family safari was amazing! The team accommodated our needs with two young children, making it educational and fun for everyone. We created memories that will last a lifetime.",
      author: "James Taylor",
      location: "South Africa",
      image: "https://picsum.photos/seed/person6/60/60.jpg"
    }
  ];

  return (
    <section id="testimonials" className="section-padding">
      <Container>
        <div className="text-center mb-5">
          <h2>What Our Clients Say</h2>
          <p className="lead">Read testimonials from our satisfied travelers</p>
        </div>
        <Row>
          {testimonials.map(testimonial => (
            <Col lg={4} md={6} key={testimonial.id} className="mb-4">
              <Card className="testimonial-card h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <blockquote className="testimonial-text fst-italic mb-4">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="testimonial-author d-flex align-items-center mt-auto">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="rounded-circle me-3" 
                      width="60" 
                      height="60" 
                    />
                    <div>
                      <h5 className="mb-0">{testimonial.author}</h5>
                      <p className="mb-0 text-muted">{testimonial.location}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;