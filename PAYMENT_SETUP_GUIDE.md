# Payment Integration Setup Guide

## Prerequisites

### 1. Cashfree Account Setup
1. Sign up for a Cashfree account at https://www.cashfree.com/
2. Get your App ID and Secret Key from the Cashfree dashboard
3. Make sure you're using the **Sandbox** environment for testing

### 2. Environment Variables Setup

#### Backend (.env file in prepzone-backend/)
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/prepzone

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cashfree Configuration (Sandbox)
CASHFREE_APP_ID=your_cashfree_app_id_here
CASHFREE_SECRET_KEY=your_cashfree_secret_key_here

# Email Configuration (if using nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (.env file in prepzone-frontend/)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
```

## Common Issues and Solutions

### 1. "Cashfree SDK not ready" Error
**Cause**: The Cashfree SDK failed to load
**Solution**: 
- Check your internet connection
- Verify the SDK URL is accessible: https://sandbox.cashfree.com/js/ui/checkout.js
- Check browser console for any JavaScript errors

### 2. "Cashfree order creation failed" Error
**Cause**: Backend can't create payment order
**Solutions**:
- Verify `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY` are set correctly
- Check if the environment variables are loaded properly
- Verify the Cashfree credentials are valid

### 3. CORS Errors
**Cause**: Frontend can't communicate with backend
**Solution**: 
- Backend CORS is now configured to allow localhost in development
- Make sure both frontend and backend are running on the correct ports

### 4. "Payment successful but booking failed" Error
**Cause**: Payment went through but seat booking failed
**Solution**:
- Check if the library has available seats
- Verify the user doesn't already have a reservation for that duration
- Check database connection and models

## Testing Steps

### 1. Backend Testing
```bash
cd prepzone-backend
npm install
npm start
```

Test the payment endpoint:
```bash
curl -X POST http://localhost:5000/api/payment/cashfree/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100,
    "email": "test@example.com",
    "phone": "1234567890",
    "name": "Test User"
  }'
```

### 2. Frontend Testing
```bash
cd prepzone-frontend
npm install
npm run dev
```

### 3. Payment Flow Testing
1. Login as a user
2. Go to a library booking page
3. Fill in the form details
4. Select "Online" payment mode
5. Click "Book Now"
6. Complete the payment in the Cashfree sandbox

## Debugging Tips

### 1. Check Backend Logs
Look for these console messages:
- "Cashfree Order Error:" - Payment creation issues
- "Booking error:" - Reservation creation issues

### 2. Check Frontend Console
Look for:
- "✅ Cashfree SDK loaded" - SDK loaded successfully
- "❌ Cashfree SDK failed to load" - SDK loading failed
- Network errors in the Network tab

### 3. Verify Environment Variables
Add this to your backend to debug:
```javascript
console.log("Cashfree Config:", {
  appId: process.env.CASHFREE_APP_ID ? "Set" : "Not Set",
  secretKey: process.env.CASHFREE_SECRET_KEY ? "Set" : "Not Set"
});
```

## Production Deployment

### 1. Update CORS for Production
The backend is configured to use production URL when `NODE_ENV=production`

### 2. Use Production Cashfree Credentials
Replace sandbox credentials with production ones in your production environment

### 3. Update Frontend API URL
Set `VITE_API_URL` to your production backend URL

## Support

If you're still having issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify all environment variables are set correctly
4. Test with a simple payment amount (e.g., ₹1)
5. Ensure you're using valid test data in sandbox mode 