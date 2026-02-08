import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

/**
 * WhatsApp button component for quick contact
 */
const WhatsAppButton = () => {
  // WhatsApp message with pre-filled text
  const whatsappMessage = encodeURIComponent(
    "Hello Tanzania Corridors Explorers! I'm interested in your tours."
  );
  
  // WhatsApp number (replace with actual number)
  const whatsappNumber = "255623660096";
  
  // WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-btn d-flex align-items-center justify-content-center text-white rounded-circle shadow"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faWhatsapp} size="lg" />
    </a>
  );
};

export default WhatsAppButton;