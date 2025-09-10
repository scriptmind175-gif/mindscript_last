require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5001;

// SIMPLE CORS - Allow everything for now
app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json());

// Supabase Connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

// Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    console.log('Creating order:', req.body);
    
    const { amount, currency = 'INR' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order.id);
    
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Verify Payment and Save Registration
app.post('/api/verify-payment', async (req, res) => {
  try {
    console.log('Verifying payment:', req.body);
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationData
    } = req.body;

    // Verify payment signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log('Payment verified successfully');
      
      // Validate registration data
      if (!registrationData) {
        return res.status(400).json({ success: false, message: 'Registration data is required' });
      }
      
      const { name, email, phone, courseId, courseName, amount } = registrationData;
      
      if (!name || !email || !phone || !courseId || !courseName || !amount) {
        return res.status(400).json({ success: false, message: 'Missing required registration fields' });
      }
      
      // Save registration to Supabase
      const registrationDoc = {
        name,
        email,
        phone,
        course_id: courseId,
        course_name: courseName,
        amount,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        payment_status: 'completed'
      };
      
      const { data, error } = await supabase
        .from('registrations')
        .insert([registrationDoc])
        .select();
      
      if (error) {
        console.error('Error saving registration:', error);
        return res.status(500).json({ success: false, message: 'Failed to save registration', error: error.message });
      }
      
      console.log('Registration saved:', data[0].id);
      
      res.json({ 
        success: true, 
        message: 'Payment verified and registration saved',
        registrationId: data[0].id
      });
    } else {
      console.error('Payment signature verification failed');
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
});

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching registrations:', error);
      return res.status(500).json({ error: 'Failed to fetch registrations' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

app.listen(PORT, () => {
  console.log(`Fresh backend running on port ${PORT}`);
});
