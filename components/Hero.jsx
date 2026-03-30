import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-scroll';

/**
 * Hero section component with background image and call-to-action
 */
const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <Container>
        <div className="hero-content text-center text-white">
          <h1 className="display-3 fw-bold mb-4">Discover the Beauty of Tanzania</h1>
          <p className="lead mb-5">
            Experience unforgettable safaris, cultural tours, and local adventures with Tanzania Corridors Explorers
          </p>
          <Link 
            to="tours" 
            spy={true} 
            smooth={true} 
            offset={-80} 
            duration={500}
            className="btn btn-primary btn-lg"
          >
            Explore Our Tours
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default Hero;