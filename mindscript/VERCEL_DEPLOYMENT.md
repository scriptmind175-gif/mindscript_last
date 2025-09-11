# Vercel Deployment Guide for MindScript

## Overview
This project is now configured to deploy as a single website on Vercel with serverless API functions.

## Project Structure
```
mindscript/
├── api/                    # Vercel serverless functions
│   ├── test.js            # Test endpoint
│   ├── create-order.js    # Razorpay order creation
│   ├── verify-payment.js  # Payment verification
│   └── registrations.js   # Get registrations
├── src/                   # React frontend
├── public/                # Static assets
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## Environment Variables Required
Set these in your Vercel dashboard:

### Required for Production:
- `RAZORPAY_KEY_ID` - Your Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Your Razorpay key secret
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional (for testing):
- If not set, the app will work in mock mode for testing

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the mindscript directory**:
   ```bash
   cd mindscript
   vercel
   ```

4. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add the required variables listed above

5. **Redeploy** (if you added env vars after first deploy):
   ```bash
   vercel --prod
   ```

## Features
- ✅ Single website deployment
- ✅ Serverless API functions
- ✅ CORS handled automatically
- ✅ Mock mode for testing without real credentials
- ✅ Production ready with real Razorpay integration
- ✅ Supabase integration for data storage

## API Endpoints
- `GET /api/test` - Health check
- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment and save registration
- `GET /api/registrations` - Get all registrations

## Testing Locally
```bash
cd mindscript
npm install
npm start
```

The app will run on http://localhost:3000 with API functions available at http://localhost:3000/api/*


**Note**: For local development, the API functions will work in mock mode unless you set up environment variables. For production deployment on Vercel, add your real credentials in the Vercel dashboard.
