import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MindScript</h3>
          <p>Where Mind Learns the Script</p>
          <p>Empowering minds to code, create, and innovate with confidence.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#courses">Courses</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Legal & Policies</h4>
          <ul>
            <li><a href="/privacy-policy.html" target="_blank">Privacy Policy</a></li>
            <li><a href="/terms-conditions.html" target="_blank">Terms & Conditions</a></li>
            <li><a href="/cancellation-refund.html" target="_blank">Cancellation & Refund</a></li>
            <li><a href="/shipping-delivery.html" target="_blank">Shipping & Delivery</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/contact-us.html" target="_blank">Contact Us</a></li>
            <li><a href="#courses">Course Support</a></li>
            <li><a href="#contact">Technical Help</a></li>
          </ul>
        </div>
        
       
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 MindScript. All rights reserved. | Secure payments powered by Razorpay</p>
        <p className="developer-credit">Developed by Quick Developers</p>
      </div>
    </footer>
  );
}

export default Footer;