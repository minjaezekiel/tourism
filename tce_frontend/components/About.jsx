import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-scroll';

/**
 * About section component with company information and image
 */
const About = () => {
  return (
    <section id="about" className="about-section section-padding">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="about-image rounded overflow-hidden shadow">
              <img 
                src="https://picsum.photos/seed/tanzania-team/600/400.jpg" 
                alt="Tanzania Corridors Explorers Team" 
                className="img-fluid" 
              />
            </div>
          </Col>
          <Col lg={6}>
            <h2>About Tanzania Corridors Explorers</h2>
            <p className="lead">Your gateway to authentic Tanzanian experiences</p>
            <p>
              Tanzania Corridors Explorers is a local tour company based in Tanzania, dedicated to showcasing the breathtaking beauty of our homeland. We organize safaris, cultural tours, and local experiences for both Tanzanian and international travelers.
            </p>
            <p>
              Our mission is to promote Tanzania's natural wonders, support local communities, and offer unforgettable travel experiences that connect our guests with the heart and soul of this incredible country.
            </p>
            <p>
              With years of experience and deep local knowledge, our team is committed to providing safe, enjoyable, and transformative journeys through Tanzania's most spectacular landscapes and vibrant cultures.
            </p>
            <Link 
              to="contact" 
              spy={true} 
              smooth={true} 
              offset={-80} 
              duration={500}
              className="btn btn-primary mt-3"
            >
              Get in Touch
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;