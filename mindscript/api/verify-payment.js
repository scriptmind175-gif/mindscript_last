const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
