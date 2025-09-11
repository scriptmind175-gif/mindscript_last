# 📧 Email Setup Guide

## Automatic Email Sending After Payment

The system now automatically sends confirmation emails to users after successful payment. Here's how to set it up:

## 🔧 Email Configuration

### Option 1: Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Update Vercel Environment Variables**:
   ```
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASS = your-16-character-app-password
   ```

### Option 2: Other Email Providers

#### Outlook/Hotmail:
```
EMAIL_HOST = smtp-mail.outlook.com
EMAIL_PORT = 587
EMAIL_USER = your-email@outlook.com
EMAIL_PASS = your-password
```

#### Yahoo:
```
EMAIL_HOST = smtp.mail.yahoo.com
EMAIL_PORT = 587
EMAIL_USER = your-email@yahoo.com
EMAIL_PASS = your-app-password
```

#### Custom SMTP:
```
EMAIL_HOST = your-smtp-server.com
EMAIL_PORT = 587
EMAIL_USER = your-email@domain.com
EMAIL_PASS = your-password
```

## 🚀 How to Deploy

### Step 1: Update Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:
   - `EMAIL_HOST`
   - `EMAIL_PORT` 
   - `EMAIL_USER`
   - `EMAIL_PASS`

### Step 2: Redeploy

After adding environment variables, redeploy your project:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment

## 📧 Email Features

### What Users Receive:
- ✅ **Beautiful HTML email** with your branding
- ✅ **Course details** and payment confirmation
- ✅ **Next steps** for accessing the course
- ✅ **Contact information** for support
- ✅ **Mobile-responsive** design

### Email Content Includes:
- Welcome message with user's name
- Course name and amount paid
- Payment ID for reference
- Instructions for course access
- Support contact details
- Professional MindScript branding

## 🧪 Testing

### Test with Mock Orders:
1. Use the registration form
2. Complete payment (even with test mode)
3. Check the email address for confirmation

### Check Logs:
- Go to Vercel Functions tab
- Check logs for email sending status
- Look for "Email sent successfully" messages

## 🔍 Troubleshooting

### Common Issues:

1. **"Authentication failed"**:
   - Check if 2FA is enabled
   - Verify app password is correct
   - Ensure EMAIL_USER is correct

2. **"Connection timeout"**:
   - Check EMAIL_HOST and EMAIL_PORT
   - Verify SMTP settings with your provider

3. **"Email not received"**:
   - Check spam folder
   - Verify email address is correct
   - Check Vercel function logs

### Debug Steps:
1. Check Vercel function logs
2. Verify environment variables are set
3. Test with a simple email first
4. Check email provider settings

## 📝 Email Template Customization

The email template is in `api/email-service.js`. You can customize:
- Company branding
- Email content
- Styling and colors
- Contact information
- Course access instructions

## 🎯 Next Steps

1. **Set up your email credentials** in Vercel
2. **Test the registration flow** 
3. **Check email delivery**
4. **Customize the email template** if needed
5. **Monitor email logs** for any issues

Your users will now receive beautiful, professional confirmation emails automatically after payment! 🎉
