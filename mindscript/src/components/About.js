import React, { useState } from 'react';
import './About.css';
import { courses } from '../data/courses';
import ApiService from '../services/api';

const About = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleGetCourse = () => {
    // Default to Python course (first course)
    const pythonCourse = courses[0];
    setSelectedCourse(pythonCourse);
    setShowRegistrationModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!window.Razorpay) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }
    
    try {
      setIsProcessing(true);
      setMessage('');
      
      // Validate form data
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }
      
      if (!selectedCourse) {
        throw new Error('Please select a course');
      }
      
      // Create order using ApiService (same as Courses.js)
      const orderData = await ApiService.createOrder(selectedCourse.price, 'INR');
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MindScript',
        description: `Registration for ${selectedCourse.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment using ApiService (same as Courses.js)
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationData: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                courseId: selectedCourse.id,
                courseName: selectedCourse.title,
                amount: selectedCourse.price
              }
            };
            
            const verificationResult = await ApiService.verifyPayment(verificationData);
            
            if (verificationResult.success) {
              setShowRegistrationModal(false);
              setShowSuccessPopup(true);
              setFormData({ name: '', email: '', phone: '' });
              
              // Redirect to home page after 3 seconds
              setTimeout(() => {
                setShowSuccessPopup(false);
                window.location.href = '/';
              }, 3000);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Registration failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="about-section">
      <div className="section-header">
        <h2>Why Choose MindScript?</h2>
        <p className="mission-statement">Empowering minds to code, create, and innovate with confidence. We believe everyone deserves access to world-class coding education.</p>
      </div>
      
      <div className="features-grid">
        <div className="feature-card premium">
          <div className="feature-icon-wrapper">
            <div className="feature-icon"><i className="fas fa-bolt"></i></div>
            <div className="icon-bg"></div>
          </div>
          <h4>Industry-Relevant Skills</h4>
          <p>Master Python programming with real-world applications in AI, web development, and data science. Stay ahead with cutting-edge technologies.</p>
          <div className="feature-benefits">
            <span className="benefit-tag">Python</span>
            <span className="benefit-tag">AI/ML</span>
            <span className="benefit-tag">Web Dev</span>
          </div>
        </div>
        
        <div className="feature-card premium">
          <div className="feature-icon-wrapper">
            <div className="feature-icon">👨‍💻</div>
            <div className="icon-bg"></div>
          </div>
          <h4>Expert Mentors</h4>
          <p>Learn from industry professionals with 5+ years of experience in top tech companies like Google, Amazon, and Microsoft.</p>
          <div className="feature-benefits">
            <span className="benefit-tag">1:1 Support</span>
            <span className="benefit-tag">Live Sessions</span>
            <span className="benefit-tag">Career Guidance</span>
          </div>
        </div>
        
        <div className="feature-card premium">
          <div className="feature-icon-wrapper">
            <div className="feature-icon">🎯</div>
            <div className="icon-bg"></div>
          </div>
          <h4>Project-Based Learning</h4>
          <p>Build 10+ real projects including AI chatbots, web apps, and data analysis tools. Portfolio-ready projects for your career.</p>
          <div className="feature-benefits">
            <span className="benefit-tag">10+ Projects</span>
            <span className="benefit-tag">Portfolio</span>
            <span className="benefit-tag">Real-World</span>
          </div>
        </div>
        
        <div className="feature-card premium">
          <div className="feature-icon-wrapper">
            <div className="feature-icon">🚀</div>
            <div className="icon-bg"></div>
          </div>
          <h4>Career Acceleration</h4>
          <p>Get job-ready with our comprehensive career support, interview preparation, and industry connections.</p>
          <div className="feature-benefits">
            <span className="benefit-tag">Job Ready</span>
            <span className="benefit-tag">Interview Prep</span>
            <span className="benefit-tag">Networking</span>
          </div>
        </div>
      </div>
      
      <div className="about-highlights">
        <div className="highlight-item">
          <h3><i className="fas fa-graduation-cap"></i> What You'll Learn</h3>
          <ul>
            <li>Python fundamentals and advanced concepts</li>
            <li>Web development with Django and Flask</li>
            <li>Data science and machine learning basics</li>
            <li>Database management and APIs</li>
            <li>Git version control and deployment</li>
          </ul>
        </div>
        
        <div className="highlight-item">
          <h3><i className="fas fa-briefcase"></i> Career Outcomes</h3>
          <ul>
            <li>Python Developer positions</li>
            <li>Web Developer roles</li>
            <li>Data Analyst opportunities</li>
            <li>AI/ML Engineer pathways</li>
            <li>Freelancing and remote work</li>
          </ul>
        </div>
      </div>
      
      {/* Get Course Section */}
      <div className="get-course-section">
        <div className="section-header">
          <h2>Ready to Start Your Journey?</h2>
          <p className="mission-statement">Join thousands of students who have transformed their careers with our comprehensive Python course.</p>
        </div>
        <div className="course-cta" style={{textAlign: 'center', margin: '2rem 0'}}>
          <button className="btn" onClick={handleGetCourse}>Get Course</button>
        </div>
      </div>
      
      <div className="team-section">
        <div className="section-header">
          <h2>Meet Our Expert</h2>
          <p className="mission-statement">Learn from an industry professional who is passionate about sharing knowledge and helping you succeed.</p>
        </div>
        
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">
              <span role="img" aria-label="Founder">👨‍💻</span>
            </div>
            <div className="member-info">
              <h3>KORA NAGA MASTAN SAI</h3>
              <div className="member-role">Co-Founder & Lead Instructor</div>
              <div className="member-experience">2+ Years Experience in Python Teaching</div>
              <p className="member-bio">
                Experienced Python instructor specializing in AI, Data Analytics, and Machine Learning. 
                Passionate about making complex programming concepts accessible to everyone through practical learning.
              </p>
              <div className="member-skills">
                <span className="skill-tag">PYTHON</span>
                <span className="skill-tag">AI</span>
                <span className="skill-tag">DATA ANALYTICS</span>
                <span className="skill-tag">AI-ML</span>
              </div>
              <div className="member-achievements">
                <div className="achievement"><i className="fas fa-trophy"></i> Trained 1000+ Students</div>
                <div className="achievement"><i className="fas fa-book"></i> Published 50+ Tutorials</div>
                <div className="achievement"><i className="fas fa-star"></i> 4.9/5 Instructor Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-values">
          <h3>Our Teaching Philosophy</h3>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon"><i className="fas fa-bullseye"></i></div>
              <h4>Practical Learning</h4>
              <p>We believe in learning by doing. Every concept is taught through real-world projects and examples.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h4>Personal Support</h4>
              <p>Each student gets personalized attention and support throughout their learning journey.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🚀</div>
              <h4>Career Focus</h4>
              <p>Our goal is not just to teach coding, but to help you build a successful tech career.</p>
            </div>
          </div>
        </div>
      </div>

      {showRegistrationModal && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register for Python Course</h3>
              <button className="close-btn" onClick={() => setShowRegistrationModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="registration-form">
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={handleInputChange}
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              <select 
                name="course" 
                value={formData.course}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course.title}>{course.title}</option>
                ))}
              </select>
              <div className="form-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowRegistrationModal(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-content">
            <h3>Payment Successful!</h3>
            <p>Your registration has been completed successfully.</p>
            <p>Redirecting to home page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;