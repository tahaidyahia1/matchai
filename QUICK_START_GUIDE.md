# Matchai Loyalty System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

Your enterprise-grade loyalty system is ready! Follow these steps to start using it immediately.

## Step 1: Create Your First Admin Account (2 minutes)

### Generate Password Hash

Open your terminal and run:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('YourPassword123!').digest('hex'))"
```

Replace `YourPassword123!` with your desired password. Copy the output hash.

### Insert Admin User

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run this query (replace the hash):

```sql
INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@matchai.ma',
  'PASTE_YOUR_HASH_HERE',
  'Matchai Administrator',
  'super_admin',
  true
);
```

## Step 2: Sign In to Admin Dashboard (30 seconds)

1. Navigate to: `https://your-domain.com/admin/login`
2. Enter credentials:
   - Email: `admin@matchai.ma`
   - Password: (the password you used above)
3. Click "Sign In"

## Step 3: Add Your First Rewards (2 minutes)

In the admin dashboard:

1. Click the "Rewards" tab
2. Click "Add New Reward"
3. Create a few rewards, for example:

**Free Matcha Latte**
- Points Required: 50
- Category: drink
- Description: Redeem for any size matcha latte

**10% Off**
- Points Required: 30
- Category: discount
- Description: 10% off your next purchase

**Free Pastry**
- Points Required: 40
- Category: food
- Description: Choose any pastry from our selection

## Step 4: Test Customer Experience (1 minute)

1. Open your main website: `https://your-domain.com/loyalty`
2. Click "Sign In / Sign Up"
3. Create a test customer account
4. You should see:
   - 0 points balance
   - Green Member tier
   - Your rewards catalog

## Step 5: Test Points & Redemption (30 seconds)

### Add Points to Test Customer
1. Go back to admin dashboard
2. Click "Customers" tab
3. Find your test customer
4. Click "Adjust Points"
5. Add 100 points with reason "Testing"
6. Confirm

### Redeem a Reward
1. Refresh customer loyalty page
2. Click "Browse Rewards"
3. Click "Redeem" on a 50-point reward
4. Confirm redemption
5. Note your redemption code

### Approve Redemption
1. Go to admin "Redemptions" tab
2. See your pending redemption
3. Click approve button
4. Mark as fulfilled when customer picks up

## ✅ You're All Set!

Your loyalty system is now fully operational with:

- ✅ Admin dashboard access
- ✅ Rewards catalog configured
- ✅ Points system working
- ✅ Redemption workflow tested
- ✅ Customer experience verified

## 📊 What Customers Can Do

- Sign up and create loyalty accounts
- View their points balance and tier
- Browse available rewards
- Redeem rewards with instant codes
- Track redemption status
- View transaction history

## 🛠️ What Admins Can Do

**Customer Management**
- View all customers with search
- Adjust customer points (+ or -)
- View customer transaction history
- Monitor customer tier progression

**Rewards Management**
- Create new rewards
- Edit existing rewards
- Set stock quantities
- Activate/deactivate rewards
- Organize by category

**Redemption Processing**
- View pending redemptions
- Approve redemptions
- Mark as fulfilled
- Track redemption codes

**Promotions**
- Create bonus point campaigns
- Set point multipliers
- Schedule promotions
- Manage active campaigns

**Analytics**
- Total customers
- Total points issued
- Pending redemptions
- Tier distribution
- Complete audit logs

## 🎯 Daily Operations

### When a Customer Makes a Purchase
1. Log in to admin dashboard
2. Go to "Customers" tab
3. Search for customer
4. Click "Adjust Points"
5. Enter purchase amount in points (divide by 10)
6. Add reason: "Purchase - [amount] MAD"

### When a Customer Wants to Redeem
1. Customer signs in to their account
2. Customer browses rewards
3. Customer redeems desired reward
4. Customer receives redemption code
5. Customer shows code at store
6. Staff approves in admin dashboard
7. Staff marks as fulfilled after giving reward

## 💡 Pro Tips

1. **First Week**: Give new customers 50 bonus points to try the system
2. **Busy Times**: Pre-approve common redemptions for faster service
3. **Marketing**: Promote rewards in-store and on social media
4. **Feedback**: Ask customers about rewards they'd like to see
5. **Monitor**: Check audit logs weekly for unusual activity

## 🔒 Security Reminders

- ✅ Change the default admin password immediately
- ✅ Use strong, unique passwords (12+ characters)
- ✅ Don't share admin credentials
- ✅ Review audit logs regularly
- ✅ Only create admin accounts for trusted staff

## 📱 Customer Access Methods

**With Account**
- Sign in at /loyalty
- Full dashboard access
- Redeem rewards
- View history

**Without Account**
- Enter phone number for balance lookup
- Quick points check
- See current tier
- Encouraged to sign up for redemptions

## 🎉 Popular Reward Ideas

**Low Tier (20-50 points)**
- Size upgrades
- Extra shot of matcha
- Free add-ons
- Small discounts

**Mid Tier (50-100 points)**
- Free drinks
- Free food items
- Percentage discounts
- Merchandise discounts

**High Tier (100-200+ points)**
- Large vouchers
- Multiple free items
- VIP experiences
- Exclusive events

## 📈 Growing Your Program

**Week 1-2**: Focus on sign-ups and education
**Week 3-4**: Monitor redemption patterns
**Month 2**: Adjust rewards based on data
**Month 3+**: Add seasonal promotions

## 🆘 Need Help?

**Customer Issues**
- Check LOYALTY_SYSTEM_DOCUMENTATION.md
- Review transaction history in admin
- Verify account status

**Technical Issues**
- Check Supabase logs
- Review edge function status
- Verify database connections

**Admin Issues**
- Verify admin account is active
- Check audit logs
- Review credentials

## 🎊 Success Metrics to Track

- Daily new sign-ups
- Average points per customer
- Redemption rate
- Most popular rewards
- Customer tier distribution
- Repeat customer rate

## Next Steps

1. ✅ Add more rewards to your catalog
2. ✅ Train staff on redemption process
3. ✅ Create in-store signage
4. ✅ Set up first promotion
5. ✅ Start collecting customer feedback

**Your loyalty system is enterprise-ready and fail-proof. Start rewarding your customers today!** 🚀
