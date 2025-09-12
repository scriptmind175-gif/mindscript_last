# 🔧 Email Fix Guide - Step by Step

## 🚨 **Current Issues Fixed:**

1. ✅ **Removed placeholder email credentials** from vercel.json
2. ✅ **Added detailed error logging** for email debugging
3. ✅ **Created test email endpoint** for testing
4. ✅ **Improved error handling** in payment verification

## 🚀 **How to Fix Your Email (Follow These Steps):**

### Step 1: Set Up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Add Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `mindscript` project
3. Go to **Settings** → **Environment Variables**
4. Add these 4 variables:

```
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = your-actual-email@gmail.com
EMAIL_PASS = your-16-character-app-password
```

**Important:** 
- Use your actual Gmail address for `EMAIL_USER`
- Use the 16-character app password (not your regular password) for `EMAIL_PASS`
- Remove spaces from the app password if any

### Step 3: Test Email Functionality

1. **Deploy your changes** to Vercel
2. **Test the email endpoint** by making a POST request to:
   ```
   https://mindscript.online/api/test-email
   ```
   
   With this JSON body:
   ```json
   {
     "name": "Your Name",
     "email": "your-test-email@gmail.com",
     "courseName": "Test Course",
     "amount": 999
   }
   ```

3. **Check the response** - it will tell you if the email was sent successfully

### Step 4: Check Vercel Logs

1. Go to your Vercel project dashboard
2. Click on **Functions** tab
3. Look for logs from the test-email function
4. You should see detailed logs like:
   ```
   📧 Starting email send process...
   📧 Email config check: { host: 'smtp.gmail.com', port: 587, user: '***@gmail.com', pass: '***' }
   📧 Verifying SMTP connection...
   ✅ SMTP connection verified successfully
   📧 Sending email to: your-test-email@gmail.com
   ✅ Email sent successfully! Message ID: <message-id>
   ```

## 🧪 **Testing Steps:**

### Test 1: Environment Variables
```bash
curl -X POST https://mindscript.online/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"your-email@gmail.com","courseName":"Test Course","amount":999}'
```

### Test 2: Full Registration Flow
1. Go to your website
2. Fill out the registration form
3. Complete payment (even in test mode)
4. Check if you receive the confirmation email

## 🔍 **Troubleshooting:**

### If you get "Authentication failed":
- ✅ Check if 2FA is enabled on Gmail
- ✅ Verify you're using the app password (not regular password)
- ✅ Make sure EMAIL_USER is your full Gmail address

### If you get "Connection timeout":
- ✅ Check EMAIL_HOST is `smtp.gmail.com`
- ✅ Check EMAIL_PORT is `587`
- ✅ Verify your internet connection

### If emails go to spam:
- ✅ Check spam folder
- ✅ Add your email to contacts
- ✅ Consider using a custom domain email

## 📧 **Email Features Working:**

- ✅ Beautiful HTML email template
- ✅ Course details and payment confirmation
- ✅ Professional MindScript branding
- ✅ Mobile-responsive design
- ✅ Both HTML and text versions

## 🎯 **Next Steps After Fix:**

1. **Set up your email credentials** in Vercel
2. **Test with the test-email endpoint**
3. **Test the full registration flow**
4. **Check that emails are delivered**
5. **Monitor logs for any issues**

## 📞 **Need Help?**

If you're still having issues:
1. Check the Vercel function logs
2. Test with the `/api/test-email` endpoint
3. Verify all environment variables are set correctly
4. Make sure you're using the app password, not your regular Gmail password

Your email functionality should work perfectly after following these steps! 🎉
