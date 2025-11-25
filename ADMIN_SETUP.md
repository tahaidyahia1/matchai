# Admin Setup Instructions

## Initial Admin Account Setup

To create your first admin account, you need to insert a record directly into the `admin_users` table. Here's how:

### Step 1: Generate Password Hash

The system uses SHA-256 hashing for passwords. You can generate a hash using Node.js:

```javascript
const crypto = require('crypto');
const password = 'Matchai@777321';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(hash);
```

Or using an online SHA-256 generator (be careful with sensitive data).

### Step 2: Insert Admin User

Run this SQL query in your Supabase SQL Editor:

```sql
INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@matchai.ma',
  'YOUR_GENERATED_HASH_HERE',
  'Matchai Administrator',
  'super_admin',
  true
);
```

Replace `YOUR_GENERATED_HASH_HERE` with the hash you generated in Step 1.

### Step 3: Access Admin Portal

1. Navigate to: `https://your-domain.com/admin/login`
2. Sign in with your credentials:
   - Email: admin@matchai.ma
   - Password: (the password you used to generate the hash)

## Adding Sample Rewards

After logging in to the admin dashboard, you can add rewards through the UI. Here are some sample rewards you might want to add:

### Drinks
- **Free Matcha Latte** - 50 points
- **Free Iced Matcha** - 50 points
- **Free Signature Drink** - 75 points
- **Size Upgrade** - 20 points

### Food
- **Free Pastry** - 40 points
- **Free Dessert** - 60 points

### Discounts
- **10% Off Next Purchase** - 30 points
- **20% Off Next Purchase** - 60 points
- **50 MAD Voucher** - 100 points

### VIP Experiences
- **VIP Tasting Event** - 200 points
- **Private Matcha Workshop** - 300 points

## Security Best Practices

1. **Change Default Password**: After first login, create a new admin account with a strong, unique password
2. **Use Strong Passwords**: At least 12 characters with uppercase, lowercase, numbers, and symbols
3. **Limit Admin Access**: Only create admin accounts for trusted personnel
4. **Regular Audits**: Review the admin audit logs regularly
5. **Monitor Activity**: Check for suspicious admin actions

## Admin Features

### Dashboard Overview
- Total customers count
- Total points issued
- Pending redemptions
- Tier distribution

### Customer Management
- View all customers
- Search by name, email, or phone
- Adjust points (add/subtract)
- View customer transaction history

### Rewards Management
- Create new rewards
- Edit existing rewards
- Set stock quantities
- Activate/deactivate rewards

### Redemption Management
- View pending redemptions
- Approve redemptions
- Mark as fulfilled
- View redemption codes

### Promotions
- Create promotional campaigns
- Set multipliers and bonus points
- Schedule promotions
- Activate/deactivate campaigns

### Audit Logs
- Track all admin actions
- View timestamps and details
- Monitor security events

## Troubleshooting

### Can't Login
- Verify password hash is correct
- Check if admin account is active (`is_active = true`)
- Verify email is correct

### Missing Features
- Ensure all migrations have been applied
- Check browser console for errors
- Verify edge functions are deployed

### Performance Issues
- Database has proper indexes
- RLS policies are optimized
- Check Supabase dashboard for slow queries

## Support

For technical issues or questions, contact your development team.
