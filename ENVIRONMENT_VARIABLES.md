# Environment Variables Configuration

This document lists all the environment variables required for the Bidzu application to run successfully both locally and on Vercel.

## Required Environment Variables

### Firebase Configuration
These are required for authentication and Firebase services:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Server Configuration
These are required for API communication:

```env
NEXT_PUBLIC_SERVER_URL=https://your-backend-server.com
NEXT_PUBLIC_SERVER_WS_URL=wss://your-backend-server.com
```

### Payment Gateway Configuration
These are required for payment processing:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Social Media Integration
These are optional but recommended for social features:

```env
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

### Push Notifications
This is required for web push notifications:

```env
VAPID_PUBLIC_KEY=your_vapid_public_key
```

### Google Maps
This is required for map functionality:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Application URL
This is used for security checks:

```env
APP_URL=https://your-domain.com
```

## Local Development Setup

1. Create a `.env.local` file in the project root
2. Copy all the required environment variables above
3. Fill in your actual values for each variable

## Vercel Deployment Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each environment variable listed above
4. Make sure to set the appropriate environment (Production, Preview, Development)

## Environment Variable Sources

### Firebase Configuration
- Get these values from your Firebase Console
- Go to Project Settings > General > Your apps
- Copy the configuration values

### Server Configuration
- Set these to your backend API server URLs
- Make sure they're accessible from your deployment domain

### Payment Gateways
- Get Razorpay key from your Razorpay dashboard
- Get Stripe key from your Stripe dashboard

### Google Maps
- Get API key from Google Cloud Console
- Enable Maps JavaScript API

### VAPID Key
- Generate using web-push library or get from your backend service

## Security Notes

- All `NEXT_PUBLIC_*` variables are exposed to the client-side
- Keep sensitive server-side variables (like API secrets) separate
- Never commit `.env.local` files to version control
- Use different values for development, staging, and production environments

## Troubleshooting

If you encounter build errors:
1. Ensure all required environment variables are set
2. Check that Firebase configuration values are correct
3. Verify that server URLs are accessible
4. Make sure payment gateway keys are valid 