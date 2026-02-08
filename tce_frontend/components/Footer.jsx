import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faInstagram, 
  faTwitter, 
  faYoutube, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-scroll';

/**
 * Footer component with company information and links
 */
const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Social media links
  const socialLinks = [
    { icon: faFacebookF, url: '#' },
    { icon: faInstagram, url: '#' },
    { icon: faTwitter, url: '#' },
    { icon: faYoutube, url: '#' },
    { icon: faLinkedinIn, url: '#' }
  ];
  
  // Quick navigation links
  const quickLinks = [
    { name: 'Home', target: 'home' },
    { name: 'About Us', target: 'about' },
    { name: 'Tour Packages', target: 'tours' },
    { name: 'Gallery', target: 'gallery' },
    { name: 'Testimonials', target: 'testimonials' },
    { name: 'Blog', target: 'blog' },
    { name: 'Contact', target: 'contact' }
  ];
  
  // Popular tours
  const popularTours = [
    'Serengeti Safari Adventure',
    'Mount Kilimanjaro Trek',
    'Zanzibar Beach Holiday',
    'Maasai Cultural Experience',
    'Ngorongoro Crater Tour'
  ];

  return (
    <footer className="bg-dark text-white pt-5 pb-2">
      <Container>
        <Row>
          <Col lg={4} className="mb-4 mb-lg-0">
            <div className="footer-widget">
              <h3 className="text-primary mb-4">Tanzania Corridors Explorers</h3>
              <p>
                Your gateway to authentic Tanzanian experiences. Discover the beauty of Tanzania with our expertly crafted safaris, cultural tours, and local adventures.
              </p>
              <div className="social-links mt-3">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    className="me-2 d-inline-flex align-items-center justify-content-center bg-white bg-opacity-10 text-white rounded-circle"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <FontAwesomeIcon icon={link.icon} />
                  </a>
                ))}
              </div>
            </div>
          </Col>
          
          <Col lg={2} className="mb-4 mb-lg-0">
            <div className="footer-widget">
              <h3 className="text-primary mb-4">Quick Links</h3>
              <ul className="list-unstyled footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index} className="mb-2">
                    <Link 
                      to={link.target} 
                      spy={true} 
                      smooth={true} 
                      offset={-80} 
                      duration={500}
                      className="text-white-50 text-decoration-none"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          
          <Col lg={3} className="mb-4 mb-lg-0">
            <div className="footer-widget">
              <h3 className="text-primary mb-4">Popular Tours</h3>
              <ul className="list-unstyled footer-links">
                {popularTours.map((tour, index) => (
                  <li key={index} className="mb-2">
                    <Link 
                      to="tours" 
                      spy={true} 
                      smooth={true} 
                      offset={-80} 
                      duration={500}
                      className="text-white-50 text-decoration-none"
                    >
                      {tour}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          
          <Col lg={3}>
            <div className="footer-widget">
              <h3 className="text-primary mb-4">Contact Info</h3>
              <ul className="list-unstyled footer-links">
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-2">
                    <FontAwesomeIcon icon="map-marker-alt" />
                  </span>
                  <span>Arusha, Tanzania</span>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-2">
                    <FontAwesomeIcon icon="phone" />
                  </span>
                  <span>+255 623 660 096</span>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-2">
                    <FontAwesomeIcon icon="envelope" />
                  </span>
                  <span>info@tanzaniacorridorsexplorers.com</span>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        
        <div className="copyright text-center pt-4 mt-4 border-top border-secondary">
          <p className="text-white-50 mb-0">
            &copy; {currentYear} Tanzania Corridors Explorers. All Rights Reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;