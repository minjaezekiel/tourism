import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Navbar from './../components/Navbar.jsx';
import Hero from './../components/Hero';
import About from './../components/About';
import Tours from './../components/Tours';
import Gallery from './../components/Gallery';
import Testimonials from './../components/Testimonials';
import Blog from './../components/Blog';
import Contact from './../components/Contact';
import Footer from './../components/Footer';
import WhatsAppButton from './../components/WhatsAppButton';
import AdminLogin from './../pages/AdminLogin';
import ForgotPassword from './../pages/ForgotPassword';
import AdminDashboard from './../pages/AdminDashBoard';

/**
 * Main App component with routing
 */
function App() {
  // State to track the active section for navigation highlighting
  const [activeSection, setActiveSection] = useState('home');

  // Effect to handle scroll events and update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'tours', 'gallery', 'testimonials', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Website Routes */}
        <Route path="/" element={
          <div className="App">
            <Navbar activeSection={activeSection} />
            <Hero />
            <About />
            <Tours />
            <Gallery />
            <Testimonials />
            <Blog />
            <Contact />
            <Footer />
            <WhatsAppButton />
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}


export default App;