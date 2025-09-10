import React from "react";
import "./Contact.css";

function Contact({ id }) {
  return (
    <section id={id} className="section contact">
      <div className="contact-container">
        <h2>Get In Touch With Us</h2>
        <p className="contact-intro">
          Have questions about our courses or need support? We're here to help! 
          Reach out to us through any of the methods below.
        </p>

        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h3>Contact Information</h3>
            
            <div className="contact-method">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-text">
                <h4>Email Us</h4>
                <p>mindscript00@gmail.com</p>
                <p>kavala.raja.surendra@gmail.com</p>
                <span className="response-time">Response within 24 hours</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="contact-text">
                <h4>Call Us</h4>
                <p>+91 8074896216</p>
                <p>+91 7382674033</p>
                <span className="response-time">Mon-Fri: 9:00 AM - 6:00 PM IST</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-text">
                <h4>Location</h4>
                <p>Online Learning Platform</p>
                <p>Serving Students Worldwide</p>
                <span className="response-time">Available 24/7</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="contact-text">
                <h4>Office Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <span className="response-time">Sunday: Closed</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-section">
              <h4>Follow Us</h4>
              <div className="socials">
                <a href="https://www.facebook.com/profile.php?id=61579903346675" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                <a href="https://www.instagram.com/quickdevelop.tech?igsh=MXB6ZXg0eHBkZm95aw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How do I enroll in a course?</h4>
              <p>Simply browse our courses, click "Register Now" on your preferred course, and complete the payment process.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit/debit cards, UPI, net banking, and digital wallets through Razorpay.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer refunds?</h4>
              <p>No, we operate under a strict no refund policy. All sales are final and payments are non-refundable.</p>
            </div>
            <div className="faq-item">
              <h4>How long do I have access to the course?</h4>
              <p>Once enrolled, you have lifetime access to the course materials and any future updates.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;