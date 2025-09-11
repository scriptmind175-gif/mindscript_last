import React, { useState } from "react";
import "./Hero.css";
import { courses } from "../data/courses";
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const { user, login, register } = useAuth();

  const handleGetCourse = () => {
    const coursesSection = document.querySelector('.courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
      let result;
      if (authMode === 'login') {
        result = await login(data.email, data.password);
      } else {
        result = await register(data.name, data.email, data.phone, data.password);
      }
      
      if (result.success) {
        setShowAuthModal(false);
        setShowModal(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!user) {
      setShowModal(false);
      setShowAuthModal(true);
      return;
    }
    
    const formData = new FormData(event.target);
    const registrationData = Object.fromEntries(formData);
    
    if (!window.Razorpay) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Find course ID from courses data
      const selectedCourse = courses.find(c => c.title === registrationData.course);
      if (!selectedCourse) {
        alert('Course not found');
        return;
      }
      
      // Create order on backend
      const orderData = await ApiService.createOrder(selectedCourse.id);
      
      const options = {
        key: "rzp_live_R6kzNc1g06owLV",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "MindScript",
        description: `${registrationData.course} Registration`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: selectedCourse.id
            };
            
            const verificationResult = await ApiService.verifyPayment(verificationData);
            
            if (verificationResult.success) {
              alert('Registration successful! Welcome to the course.');
              console.log('Registration saved:', verificationResult.registration);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Registration failed. Please contact support.');
          } finally {
            setShowModal(false);
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: "#3399cc"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <section className="hero">
      <h1 className="hero-title">Master Coding & AI</h1>
      <h2 className="hero-tagline">Where Mind Learns the Script</h2>
      <p className="hero-desc">
        Transform your future with our cutting-edge courses. Learn from industry experts, build real-world projects, and join a community of innovators. Start your tech journey today!
      </p>
      <div className="hero-stats">
        <div className="stat">
          <span className="stat-number">500+</span>
          <span className="stat-label">Students Enrolled</span>
        </div>
        <div className="stat">
          <span className="stat-number">95%</span>
          <span className="stat-label">Success Rate</span>
        </div>
        <div className="stat">
          <span className="stat-number">₹199+</span>
          <span className="stat-label">Starting From</span>
        </div>
      </div>
      <button onClick={handleGetCourse} className="hero-cta">Start Learning Now</button>

      {/* Modal is kept for potential future use but won't be triggered by the main button */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={closeAuthModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{authMode === 'login' ? 'Login' : 'Create Account'}</h3>
              <button className="close-btn" onClick={closeAuthModal}>&times;</button>
            </div>
            <form onSubmit={handleAuthSubmit} className="registration-form">
              {authMode === 'register' && (
                <input type="text" name="name" placeholder="Full Name" required />
              )}
              <input type="email" name="email" placeholder="Email Address" required />
              {authMode === 'register' && (
                <input type="tel" name="phone" placeholder="Phone Number" required />
              )}
              <input type="password" name="password" placeholder="Password" required />
              <div className="form-buttons">
                <button type="button" className="btn-secondary" onClick={closeAuthModal}>Cancel</button>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Please wait...' : (authMode === 'login' ? 'Login' : 'Create Account')}
                </button>
              </div>
            </form>
            <p style={{textAlign: 'center', marginTop: '1em', color: '#fff'}}>
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                style={{background: 'none', border: 'none', color: '#ffb347', cursor: 'pointer', textDecoration: 'underline'}}
              >
                {authMode === 'login' ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register for Course</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="registration-form">
              <input type="text" name="name" placeholder="Full Name" defaultValue={user?.name} required />
              <input type="tel" name="number" placeholder="Phone Number" defaultValue={user?.phone} required />
              <input type="email" name="email" placeholder="Email Address" defaultValue={user?.email} required />
              <select name="course" required>
                <option value="">Select Course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course.title}>{course.title}</option>
                ))}
              </select>
              <div className="form-buttons">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Processing...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;