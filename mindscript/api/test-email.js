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
    
    // Test email data
    const testEmailData = {
      name: body.name || 'Test User',
      email: body.email || 'test@example.com',
      courseName: body.courseName || 'Test Course',
      amount: body.amount || 999,
      paymentId: body.paymentId || `test_${Date.now()}`
    };

    console.log('🧪 Testing email functionality...');
    console.log('📧 Test email data:', testEmailData);

    // Check environment variables
    const envCheck = {
      EMAIL_HOST: process.env.EMAIL_HOST || 'NOT_SET',
      EMAIL_PORT: process.env.EMAIL_PORT || 'NOT_SET',
      EMAIL_USER: process.env.EMAIL_USER ? '***@' + process.env.EMAIL_USER.split('@')[1] : 'NOT_SET',
      EMAIL_PASS: process.env.EMAIL_PASS ? '***' : 'NOT_SET'
    };

    console.log('🔧 Environment variables check:', envCheck);

    // Send test email
    const result = await sendRegistrationEmail(testEmailData);

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      res.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId,
        testData: testEmailData,
        envCheck: envCheck
      });
    } else {
      console.log('❌ Test email failed:', result.error);
      res.status(500).json({
        success: false,
        error: result.error,
        code: result.code,
        testData: testEmailData,
        envCheck: envCheck,
        message: 'Test email failed. Check the error details and environment variables.'
      });
    }

  } catch (error) {
    console.error('❌ Test email endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Test email endpoint failed'
    });
  }
};
