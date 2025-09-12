const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { sendRegistrationEmail } = require('./email-service');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    console.log('🔍 Payment verification request received:');
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationData
    } = body;
    
    console.log('📋 Extracted data:');
    console.log('Order ID:', razorpay_order_id);
    console.log('Payment ID:', razorpay_payment_id);
    console.log('Registration Data:', registrationData);

    // For mock orders or test orders, skip verification
    if (razorpay_order_id && (razorpay_order_id.startsWith('mock_order_') || razorpay_order_id === 'test_order')) {
      console.log('🧪 Test/Mock order detected, skipping signature verification');
      
      // Validate registration data
      if (!registrationData) {
        console.log('❌ No registration data provided for test order');
        return res.status(400).json({ success: false, message: 'Registration data is required' });
      }
      
      const { name, email, phone, courseId, courseName, amount } = registrationData;
      
      if (!name || !email || !phone || !courseId || !courseName || !amount) {
        return res.status(400).json({ success: false, message: 'Missing required registration fields' });
      }
      
      // Send confirmation email for mock orders
      try {
        const emailData = {
          name,
          email,
          courseName,
          amount,
          paymentId: `mock_${Date.now()}`
        };
        
        console.log('📧 Sending mock order confirmation email...');
        const emailResult = await sendRegistrationEmail(emailData);
        
        if (emailResult.success) {
          console.log('✅ Mock order email sent successfully');
        } else {
          console.error('❌ Mock order email failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Error sending mock order email:', emailError);
        // Don't fail the registration if email fails
      }
      
      return res.json({ 
        success: true, 
        message: 'Mock payment verified and registration saved',
        registrationId: `mock_reg_${Date.now()}`,
        mock: true
      });
    }

    // Verify payment signature
    console.log('🔐 Verifying payment signature for real payment...');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log('✅ Payment signature verified successfully');
      
      // Validate registration data
      if (!registrationData) {
        console.log('❌ No registration data provided');
        return res.status(400).json({ success: false, message: 'Registration data is required' });
      }
      
      console.log('📋 Registration data validation passed');
      
      const { name, email, phone, courseId, courseName, amount } = registrationData;
      
      if (!name || !email || !phone || !courseId || !courseName || !amount) {
        return res.status(400).json({ success: false, message: 'Missing required registration fields' });
      }
      
      // Initialize Supabase
      const supabase = createClient(
        process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.SUPABASE_ANON_KEY || 'placeholder_key'
      );
      
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
      
      // Registration saved successfully
      console.log('💾 Registration saved to database successfully');
      
      // Send confirmation email
      try {
        const emailData = {
          name,
          email,
          courseName,
          amount,
          paymentId: razorpay_payment_id
        };
        
        console.log('📧 Sending registration confirmation email...');
        console.log('📧 Email data:', emailData);
        const emailResult = await sendRegistrationEmail(emailData);
        
        if (emailResult.success) {
          console.log('✅ Registration email sent successfully');
        } else {
          console.error('❌ Registration email failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Error sending registration email:', emailError);
        // Don't fail the registration if email fails
      }
      
      res.json({ 
        success: true, 
        message: 'Payment verified and registration saved',
        registrationId: data[0].id
      });
    } else {
      console.log('❌ Payment signature verification failed');
      console.log('Expected signature:', expectedSignature);
      console.log('Received signature:', razorpay_signature);
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};