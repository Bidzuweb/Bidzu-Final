# Vercel Deployment Checklist

Use this checklist to ensure your Bidzu application deploys successfully on Vercel.

## Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] All Firebase environment variables are set in Vercel
- [ ] Server URL environment variables are configured
- [ ] Payment gateway keys are added
- [ ] Google Maps API key is configured
- [ ] VAPID public key is set
- [ ] Facebook App ID is configured (if using social features)
- [ ] APP_URL is set to your production domain

### ✅ Firebase Configuration
- [ ] Firebase project is created and configured
- [ ] Authentication is enabled in Firebase Console
- [ ] Firebase project settings are copied correctly
- [ ] Domain is added to Firebase authorized domains

### ✅ Backend Server
- [ ] Backend server is deployed and accessible
- [ ] CORS is configured to allow your Vercel domain
- [ ] WebSocket server is running (if using real-time features)
- [ ] API endpoints are responding correctly

### ✅ Payment Gateways
- [ ] Razorpay account is configured
- [ ] Stripe account is set up
- [ ] Payment gateway keys are valid
- [ ] Webhook endpoints are configured

### ✅ Google Services
- [ ] Google Maps API is enabled
- [ ] API key has proper restrictions
- [ ] Billing is enabled for Google Cloud project

## Vercel Configuration

### ✅ Project Settings
- [ ] Framework preset is set to Next.js
- [ ] Build command is: `npm run build`
- [ ] Output directory is: `.next`
- [ ] Install command is: `npm install`
- [ ] Node.js version is 18.x or higher

### ✅ Environment Variables in Vercel
Navigate to your Vercel project dashboard → Settings → Environment Variables and add:

#### Production Environment:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_SERVER_URL=https://your-production-backend.com
NEXT_PUBLIC_SERVER_WS_URL=wss://your-production-backend.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_production_razorpay_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_production_stripe_key
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
VAPID_PUBLIC_KEY=your_vapid_public_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
APP_URL=https://your-vercel-domain.vercel.app
```

#### Preview Environment (optional):
Use staging/test values for preview deployments.

## Post-Deployment Verification

### ✅ Functionality Tests
- [ ] Homepage loads correctly
- [ ] Authentication works (sign up/sign in)
- [ ] API calls are successful
- [ ] Payment processing works
- [ ] Maps functionality works
- [ ] Push notifications work
- [ ] Real-time features work (if applicable)

### ✅ Performance Checks
- [ ] Build completes successfully
- [ ] Page load times are acceptable
- [ ] No console errors in browser
- [ ] Images load correctly
- [ ] Responsive design works

### ✅ Security Verification
- [ ] HTTPS is enforced
- [ ] Environment variables are not exposed in client
- [ ] API endpoints are properly secured
- [ ] CORS is configured correctly

## Troubleshooting Common Issues

### Build Failures
1. Check environment variables are set correctly
2. Verify Firebase configuration values
3. Ensure all dependencies are installed
4. Check Node.js version compatibility

### Runtime Errors
1. Verify server URLs are accessible
2. Check payment gateway configurations
3. Ensure Google Maps API key is valid
4. Verify Firebase project settings

### Performance Issues
1. Optimize images and assets
2. Check bundle size
3. Verify caching headers
4. Monitor API response times

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Contact

If you encounter issues not covered in this checklist:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Test locally with production environment variables 