// Test script to verify backend is working
const https = require('https');

const testBackend = async () => {
  const options = {
    hostname: 'mind-script-main1.vercel.app',
    port: 443,
    path: '/api/test',
    method: 'GET',
    headers: {
      'Origin': 'https://www.mindscript.online'
    }
  };

  console.log('Testing backend...');
  console.log('URL: https://mind-script-main1.vercel.app/api/test');
  console.log('Origin: https://www.mindscript.online');

  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.end();
};

testBackend();
