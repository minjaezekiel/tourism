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

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [activeSection, setActiveSection] = useState('home');
  
  // ==========================
  // 🌙 DAY/NIGHT MODE STATE
  // ==========================
  const [theme, setTheme] = useState(() => {
    // Check local storage for saved theme, default to light
    return localStorage.getItem('theme') || 'light';
  });

  // Apply theme to the HTML root element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Scroll detection
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

  // ==========================
  // 📊 ANALYTICS TRACKING
  // ==========================
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch(`${API_URL}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device: 'desktop' }) // Backend handles real device detection anyway
        });
      } catch (err) {
        console.error('Failed to track analytics:', err);
      }
    };

    trackVisit();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            {/* PASS THEME PROPS TO NAVBAR */}
            <Navbar activeSection={activeSection} theme={theme} toggleTheme={toggleTheme} />
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

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;