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
    console.log('🧪 Testing email service on live site...');
    console.log('Environment variables:');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    const testEmailData = {
      name: 'Live Test User',
      email: 'mindscript00@gmail.com',
      courseName: 'Python Programming',
      amount: 199,
      paymentId: 'live_test_123'
    };

    console.log('Sending test email with data:', testEmailData);

    const result = await sendRegistrationEmail(testEmailData);
    
    console.log('Email result:', result);

    res.json({
      success: true,
      message: 'Email test completed',
      emailResult: result,
      environment: {
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS_SET: !!process.env.EMAIL_PASS
      }
    });

  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};
