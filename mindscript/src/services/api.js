// Use same domain for API - no CORS issues!
const API_BASE_URL = window.location.origin;

// Debug logging
console.log('Current hostname:', window.location.hostname);
console.log('Current origin:', window.location.origin);
console.log('API Base URL:', API_BASE_URL);
console.log('Razorpay Key:', 'rzp_live_R89iYFPEnIYUUv');

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
    console.log('Creating order with amount:', amount);
    return simpleFetch(`${API_BASE_URL}/api/create-order`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency })
    });
  }

  // Verify payment
  static async verifyPayment(paymentData) {
    console.log('Verifying payment:', paymentData);
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