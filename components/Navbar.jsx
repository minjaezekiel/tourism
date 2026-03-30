import React, { useState, useEffect } from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

/**
 * Navigation component with responsive design, smooth scrolling, and Dark Mode toggle
 * @param {string} activeSection - The currently active section for highlighting
 * @param {string} theme - The current theme ('light' or 'dark')
 * @param {function} toggleTheme - Function to switch between light and dark mode
 */
const Navbar = ({ activeSection, theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BSNavbar 
      expand="lg" 
      fixed="top" 
      className={scrolled ? "navbar-scrolled" : ""}
    >
      <Container>
        <BSNavbar.Brand href="#home" className="fw-bold">
          Tanzania Corridors Explorers
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Item>
              <Link 
                to="home" 
                spy={true} 
                smooth={true} 
                offset={-80} 
                duration={500}
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              >
                Home
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link 
                to="about" 
                spy={true} 
                smooth={true} 
                offset={-80} 
                duration={500}
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              >
                About Us
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link 
                to="tours" 
                spy={true} 
                smooth={true} 
                offset={-80} 
                duration={500}
                className={`nav-link ${activeSection === 'tours' ? 'active' : ''}`}
              >
                Tour Packages
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link 
                to="gallery" 
                spy={true} 
                smooth={true} 
                offset={-80} 
                duration={500}
                className={`nav-link ${activeSection === 'gallery' ? 'active' : ''}`}
              >
                Gallery
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link 
                to="testimonials" 
                spy={true} 
                smooth={true} 
                offset={-80} 
                duration={500}
                className={`nav-link ${activeSection === 'testimonials' ? 'active' : ''}`}
              >
                Testimonials
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link 
                to="blog" 
                spy={true} 
                smooth={true} 
                offset={-80} 
                duration={500}
                className={`nav-link ${activeSection === 'blog' ? 'active' : ''}`}
              >
                Blog
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link 
                to="contact" 
                spy={true} 
                smooth={true} 
                offset={-80} 
                duration={500}
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              >
                Contact
              </Link>
            </Nav.Item>

            {/* 🌙 DAY/NIGHT MODE TOGGLE BUTTON */}
            <Nav.Item className="ms-lg-3 mt-2 mt-lg-0">
              <Button 
                variant={theme === 'light' ? 'outline-dark' : 'outline-light'} 
                size="sm" 
                onClick={toggleTheme}
                className="rounded-pill px-3 d-flex align-items-center gap-2"
                title="Toggle Dark/Light Mode"
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                <span className="d-none d-md-inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
              </Button>
            </Nav.Item>

          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;