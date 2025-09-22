import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your trusted destination for beauty and wellness services. We provide professional care with a personal touch.</p>
        </div>
        

  {/* Quick Links section removed as requested */}


        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>📍 Shanti Vihar Bareilly</li>
            <li>📞 9808470386</li>
            <li>✉️ ritikkumar12bicbly@gmail.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Developer</h3>
          <ul>
            <li>👨‍💻 Ritik Kumar</li>
            <li>📧 ritikkumar12bicbly@gmail.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Hours</h3>
          <ul>
            <li>Mon-Fri: 9:00 AM - 8:00 PM</li>
            <li>Saturday: 9:00 AM - 6:00 PM</li>
            <li>Sunday: 10:00 AM - 5:00 PM</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ✨ Luxe Beauty Salon. All rights reserved. | Developed by Ritik Kumar</p>
      </div>
    </footer>
  );
};

export default Footer;
