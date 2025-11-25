# MATCHAI Deployment Instructions

## Quick Deployment to Netlify

### Step 1: Deploy the Application

1. **Drag and drop the `dist` folder to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Drag the entire `dist` folder from your project to the Netlify dashboard
   - Wait for the deployment to complete

### Step 2: Configure Custom Domain

1. **Add your custom domain `matchai.ma`**
   - In your Netlify site dashboard, go to **Domain settings**
   - Click **Add custom domain**
   - Enter `matchai.ma`
   - Follow the DNS configuration instructions provided by Netlify

2. **Update DNS records at your domain registrar**
   - Add the DNS records that Netlify provides
   - This typically includes:
     - An A record pointing to Netlify's load balancer
     - Or a CNAME record pointing to your Netlify subdomain

### Step 3: Access Your Application

Once DNS propagates (usually 5-30 minutes), your application will be accessible at:

- **Main Website**: `https://matchai.ma`
- **Admin Portal**: `https://matchai.ma/admin/login`
- **Loyalty Program**: `https://matchai.ma/loyalty`
- **Menu**: `https://matchai.ma/menu`
- **About**: `https://matchai.ma/about`
- **Contact**: `https://matchai.ma/contact`

## Admin Login Credentials

- **Email**: `admin@matchai.ma`
- **Password**: `Admin@123`

## Features Available

### Customer Features
- Browse menu items
- View loyalty program details
- Check points balance by phone number
- Sign up for loyalty program
- Redeem rewards with points
- View transaction history
- Add loyalty card to Apple Wallet

### Admin Features
- Dashboard with real-time statistics
- Process in-store purchases and award points
- View and manage all customers
- Adjust customer points manually
- Create and manage rewards
- Approve/fulfill redemptions
- Create and manage promotions
- View audit logs
- Delete customer accounts

## Technical Details

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (Database + Edge Functions)
- **Hosting**: Netlify
- **Authentication**: Supabase Auth with custom edge functions
- **Database**: PostgreSQL (via Supabase)

## Support

All configurations are complete. The application is production-ready with:
- ✅ Proper routing configuration
- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ Edge functions deployed
- ✅ Admin portal functional
- ✅ Loyalty system operational
- ✅ Row Level Security enabled
- ✅ Audit logging enabled

Simply deploy the `dist` folder and configure your domain!
