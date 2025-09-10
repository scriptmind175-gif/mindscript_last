# Deployment Guide

## Overview
This guide covers deploying the MindScript application to production. The application consists of:
- **Frontend**: React application (located in `sunny-main2/mindscript/`)
- **Backend**: Node.js API server (located in `backend/`)
- **Database**: Supabase (already configured)

## Prerequisites
- Vercel account (recommended for deployment)
- Git repository
- Environment variables configured

## Frontend Deployment

### 1. Production Build
The production build has already been created in `sunny-main2/mindscript/build/`

### 2. Environment Variables
Ensure these variables are set in your deployment platform:
```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_R89iYFPEnIYUUv
REACT_APP_API_BASE_URL=https://script-jade-alpha.vercel.app
```

### 3. Deploy to Vercel
```bash
cd sunny-main2/mindscript
npx vercel --prod
```

### 4. Alternative: Deploy to Netlify
1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

## Backend Deployment

### 1. Environment Variables
Ensure these are configured in your deployment platform:
```
SUPABASE_URL=https://ymdhgxfpmjvclwouzvld.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RAZORPAY_KEY_ID=rzp_live_R89iYFPEnIYUUv
RAZORPAY_KEY_SECRET=1XUbBndcwEWFOt8oHn9AvdRT
PORT=5001
```

### 2. Deploy to Vercel
```bash
cd backend
npx vercel --prod
```

## Database Setup (Supabase)

### Required Tables
Ensure your Supabase database has the following table:

```sql
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  course VARCHAR(255) NOT NULL,
  payment_id VARCHAR(255),
  order_id VARCHAR(255),
  signature VARCHAR(255),
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Post-Deployment Steps

### 1. Update Frontend API URL
After backend deployment, update the frontend's `.env` file:
```
REACT_APP_API_BASE_URL=https://your-backend-domain.vercel.app
```

### 2. Redeploy Frontend
After updating the API URL, redeploy the frontend.

### 3. Test Payment Integration
- Test course registration
- Verify Razorpay payment flow
- Check database entries in Supabase

## Deployment Commands Summary

```bash
# Frontend deployment
cd sunny-main2/mindscript
npm run build
npx vercel --prod

# Backend deployment
cd backend
npx vercel --prod
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows frontend domain
2. **Environment Variables**: Double-check all env vars are set
3. **API Endpoints**: Verify backend URL is correct in frontend
4. **Database Connection**: Test Supabase connection

### Monitoring
- Check Vercel deployment logs
- Monitor Supabase dashboard for database activity
- Test all API endpoints after deployment

## Production Checklist
- [ ] Frontend build created successfully
- [ ] Backend environment variables configured
- [ ] Frontend environment variables configured
- [ ] Supabase database tables created
- [ ] Payment integration tested
- [ ] CORS configured properly
- [ ] SSL certificates active
- [ ] Domain configured (if custom domain)

## Support
For deployment issues, check:
1. Vercel deployment logs
2. Browser developer console
3. Supabase logs
4. Network tab for API calls