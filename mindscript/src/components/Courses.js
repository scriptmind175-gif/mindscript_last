import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Courses.css";
import { courses } from "../data/courses";
import ApiService from '../services/api';
import SuccessNotification from './SuccessNotification';

function Courses() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    course: ''
  });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const handleGetCourse = (courseTitle) => {
    setSelectedCourse(courseTitle);
    setFormData(prev => ({ ...prev, course: courseTitle }));
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      email: '',
      course: ''
    });
    setSelectedCourse('');
  };

  const showSuccessMessage = () => {
    setShowModal(false);
    setShowSuccess(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.number) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Validate phone number
    if (formData.number.length < 10) {
      alert('Please enter a valid phone number.');
      return;
    }
    
    if (!window.Razorpay) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Find course data
      const selectedCourseData = courses.find(c => c.title === formData.course);
      if (!selectedCourseData) {
        alert('Course not found');
        return;
      }
      
      console.log('Creating order for course:', selectedCourseData);
      
      // Create order
      const orderData = await ApiService.createOrder(selectedCourseData.price, 'INR');
      console.log('Order created:', orderData);
      
      const options = {
        key: "rzp_live_R89iYFPEnIYUUv",
        amount: orderData.amount,
        currency: 'INR',
        name: 'MindScript',
        description: `Registration for ${selectedCourse}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            console.log('Payment successful:', response);
            
            // Verify payment
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationData: {
                name: formData.name,
                email: formData.email,
                phone: formData.number,
                courseId: selectedCourseData.id,
                courseName: selectedCourseData.title,
                amount: selectedCourseData.price
              }
            };
            
            const verificationResult = await ApiService.verifyPayment(verificationData);
            
            if (verificationResult.success) {
              console.log('Registration saved:', verificationResult.registration);
              resetForm();
              showSuccessMessage();
            } else {
              alert('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Registration failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.number
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            console.log('Payment modal closed');
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      
      rzp.open();
      
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order: ' + error.message + '\n\nPlease ensure the backend server is running.');
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <section className="section courses">
      <h2>Our Courses</h2>
      <div className="course-list">
        {courses.map((c, i) => (
          <div className="course-block" key={i} data-aos={c.animation}>
            <h3>{c.title}</h3>
            <p>{c.duration}</p>
            {c.highlights && (
              <ul className="course-highlights">
                {c.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            )}
            <p className="fee">
              {c.isCombo && c.originalPrice ? (
                <>
                  <span className="original-price">₹{c.originalPrice}</span>
                  <span className="current-price">₹{c.price}</span>
                </>
              ) : (
                `₹${c.price}`
              )}
            </p>
            <button className="btn" onClick={() => handleGetCourse(c.title)}>Get Course</button>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register for {selectedCourse}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
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
                name="number" 
                placeholder="Phone Number" 
                value={formData.number}
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
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Processing...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      <SuccessNotification show={showSuccess} onClose={closeSuccess} />
    </section>
  );
}

export default Courses;