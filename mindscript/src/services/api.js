// Use same domain for API - no CORS issues!
const API_BASE_URL = window.location.origin;

// API configuration

// Simple fetch helper
const simpleFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

class ApiService {
  // Create Razorpay order
  static async createOrder(amount, currency = 'INR') {
    return simpleFetch(`${API_BASE_URL}/api/create-order`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency })
    });
  }

  // Verify payment
  static async verifyPayment(paymentData) {
    return simpleFetch(`${API_BASE_URL}/api/verify-payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  // Test connection
  static async testConnection() {
    return simpleFetch(`${API_BASE_URL}/api/test`);
  }

  // Get registrations
  static async getRegistrations() {
    return simpleFetch(`${API_BASE_URL}/api/registrations`);
  }
}

export default ApiService;