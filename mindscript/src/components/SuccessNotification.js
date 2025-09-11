import React from 'react';
import './SuccessNotification.css';

const SuccessNotification = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="success-notification-overlay">
      <div className="success-notification">
        <div className="success-tick">✓</div>
        <h3>Registration Done</h3>
        <p>Thank you for registering!</p>
        <button onClick={onClose} className="success-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;
