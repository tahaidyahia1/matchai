# Matchai Loyalty System - Enterprise Documentation

## Overview

A comprehensive, enterprise-grade loyalty program system built for the Matchai matcha brand. This system provides complete points management, rewards redemption, promotional campaigns, and administrative controls.

## System Architecture

### Database Layer (Supabase PostgreSQL)

#### Core Tables

**users**
- Customer accounts with authentication
- Stores email, password hash, full name, and phone
- Foundation for all loyalty operations

**loyalty_points**
- Tracks current and lifetime points for each user
- Automatic tier calculation (Green, Silver, Gold)
- Updated in real-time with each transaction

**points_transactions**
- Complete audit trail of all point movements
- Types: purchase, redeem, bonus, adjustment
- Includes order amounts and descriptions

**rewards_catalog**
- Managed rewards offerings
- Categories: drink, food, merchandise, discount
- Stock management and availability control

**redemptions**
- Customer reward redemptions
- Unique redemption codes for verification
- Status workflow: pending → approved → fulfilled
- Admin approval and fulfillment tracking

**promotions**
- Promotional campaigns system
- Types: bonus_points, multiplier, tier_bonus
- Scheduled with start/end dates
- Minimum purchase requirements

**admin_users**
- Secure admin authentication
- Role-based access control
- Last login tracking

**admin_audit_log**
- Complete audit trail of all admin actions
- Tracks who did what, when, and why
- IP address logging for security

### Edge Functions (Deno/Supabase)

**loyalty-operations**
- Add points for purchases
- Get loyalty data
- Get transaction history
- Phone number lookup

**user-auth**
- Customer signup with secure password hashing (SHA-256)
- Customer signin with verification
- Automatic loyalty account creation

**rewards-operations**
- Get active rewards catalog
- Process reward redemptions
- Points validation and deduction
- Stock management
- Redemption code generation

**admin-operations**
- Admin authentication
- Customer management (view, search, adjust points)
- Rewards management (create, update, activate/deactivate)
- Redemption management (approve, fulfill)
- Promotion management (create, schedule, manage)
- Dashboard statistics
- Audit log access

### Frontend Architecture

**Customer Features**
- `/loyalty` - Loyalty points dashboard
- Sign up / Sign in functionality
- View points balance and tier status
- Transaction history
- Browse and redeem rewards
- View redemption status
- Phone number lookup for non-authenticated users

**Admin Features**
- `/admin/login` - Secure admin authentication
- `/admin/dashboard` - Complete management interface
  - Overview tab: Dashboard statistics and analytics
  - Customers tab: Search, view, and adjust customer points
  - Rewards tab: Create and manage rewards catalog
  - Redemptions tab: Approve and fulfill customer redemptions
  - Promotions tab: Create and manage promotional campaigns

## Key Features

### 1. Automatic Points Calculation
- 1 point earned per 10 MAD spent
- Real-time balance updates
- Automatic tier progression

### 2. Tiered System
- **Green Member** (0-99 points): Base tier with standard benefits
- **Silver Elite** (100-199 points): Enhanced benefits and multipliers
- **Gold VIP** (200+ points): Premium benefits and exclusive perks

### 3. Rewards Redemption
- Browse active rewards catalog
- Real-time points validation
- Instant redemption with unique codes
- Staff verification system
- Redemption status tracking

### 4. Admin Dashboard
- Complete customer overview with search
- Manual points adjustment with audit trail
- Rewards catalog management
- Redemption approval workflow
- Promotional campaign system
- Real-time statistics and analytics
- Complete audit logging

### 5. Security Features
- Secure password hashing (SHA-256)
- Row Level Security (RLS) policies
- Admin role-based access control
- Complete audit trail
- IP address logging
- Session management

### 6. Data Integrity
- Transactional operations
- Automatic tier recalculation
- Stock management
- Points validation before redemption
- Comprehensive error handling

## User Workflows

### Customer Journey

#### 1. Sign Up
1. Customer visits `/loyalty`
2. Clicks "Sign In / Sign Up"
3. Fills registration form (name, email, phone, password)
4. System creates account and loyalty profile
5. Starts at Green Member with 0 points

#### 2. Earn Points
- Staff records purchase amount in admin dashboard
- System calculates points (10 MAD = 1 point)
- Points added to customer balance
- Transaction recorded
- Tier automatically updated if threshold reached

#### 3. Redeem Rewards
1. Customer signs in to loyalty dashboard
2. Clicks "Browse Rewards"
3. Views available rewards with point requirements
4. Selects reward to redeem
5. Confirms redemption
6. Receives unique redemption code
7. Shows code at store
8. Staff fulfills reward in admin dashboard

#### 4. Check Balance
- Non-authenticated: Enter phone number for quick lookup
- Authenticated: Sign in for full dashboard access

### Admin Workflows

#### 1. Customer Management
1. Admin signs in to `/admin/dashboard`
2. Navigates to "Customers" tab
3. Searches for customer by name, email, or phone
4. Views complete customer profile and history
5. Adjusts points (add/subtract) with reason
6. System logs all actions to audit trail

#### 2. Rewards Management
1. Navigate to "Rewards" tab
2. Click "Add New Reward"
3. Fill in details:
   - Name and description
   - Points required
   - Category
   - Stock quantity (optional)
   - Image URL (optional)
4. Save reward
5. Activate/deactivate as needed

#### 3. Redemption Processing
1. Navigate to "Redemptions" tab
2. View pending redemptions
3. Verify customer information
4. Approve redemption
5. Customer picks up reward
6. Mark as fulfilled
7. Redemption complete

#### 4. Promotional Campaigns
1. Navigate to "Promotions" tab
2. Click "Create Promotion"
3. Configure:
   - Name and description
   - Type (bonus points, multiplier, tier bonus)
   - Value
   - Minimum purchase amount
   - Start and end dates
4. Activate promotion
5. System automatically applies during active period

## Technical Implementation

### Points Calculation
```typescript
pointsEarned = Math.floor(purchaseAmount / 10)
```

### Tier Determination
```typescript
if (totalPoints >= 200) tier = "Gold VIP"
else if (totalPoints >= 100) tier = "Silver Elite"
else tier = "Green Member"
```

### Security
- All passwords hashed using SHA-256
- RLS policies enforce data isolation
- Admin actions logged with IP addresses
- Session-based authentication

### Performance Optimizations
- Optimized RLS policies using `(select auth.uid())`
- Strategic database indexes
- Efficient query patterns
- Edge function caching

## Database Schema

### Indexes
```sql
-- Performance optimizations
CREATE INDEX idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX idx_redemptions_status ON redemptions(status);
CREATE INDEX idx_redemptions_created_at ON redemptions(created_at DESC);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date) WHERE is_active = true;
CREATE INDEX idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
```

### Row Level Security
- Users can only access their own data
- Admins can access all data when authenticated
- Public can view active rewards and promotions
- System operations use service role key

## API Endpoints

### Customer APIs
- POST `/functions/v1/user-auth` - Sign up / Sign in
- POST `/functions/v1/loyalty-operations` - Points operations
- POST `/functions/v1/rewards-operations` - Reward redemptions

### Admin APIs
- POST `/functions/v1/admin-operations` - All admin operations

All endpoints require appropriate authentication and return JSON responses with consistent error handling.

## Error Handling

### Customer Errors
- Invalid credentials
- Insufficient points for redemption
- Reward out of stock
- Account already exists

### Admin Errors
- Unauthorized access
- Invalid operation
- Missing required fields
- Concurrent modification conflicts

All errors return meaningful messages to the user while logging technical details for debugging.

## Monitoring & Analytics

### Dashboard Statistics
- Total customer count
- Total points issued (lifetime)
- Pending redemptions count
- Customer tier distribution

### Audit Logging
- All admin actions logged
- Timestamp and IP address
- Action details in JSON format
- User identification

### Transaction History
- Complete point movement tracking
- Order amount correlation
- Transaction type categorization
- Chronological ordering

## Deployment

### Prerequisites
- Supabase account with database provisioned
- Environment variables configured
- Edge functions deployed
- Initial admin account created

### Production Checklist
- ✅ All database migrations applied
- ✅ Edge functions deployed and tested
- ✅ Admin account created
- ✅ Sample rewards added
- ✅ RLS policies verified
- ✅ Audit logging functional
- ✅ Performance optimizations applied
- ✅ Error handling comprehensive
- ✅ Build successful

## Maintenance

### Regular Tasks
- Review audit logs weekly
- Monitor redemption patterns
- Adjust tier thresholds as needed
- Update rewards catalog seasonally
- Analyze customer engagement
- Check system performance

### Security Updates
- Rotate admin passwords quarterly
- Review admin access permissions
- Monitor for suspicious activity
- Keep dependencies updated
- Regular security audits

## Support & Troubleshooting

### Common Issues

**Customer can't sign in**
- Verify email and password
- Check if account exists
- Try password reset flow

**Points not updating**
- Verify purchase was recorded
- Check transaction history
- Review edge function logs

**Redemption code not working**
- Check redemption status
- Verify code entered correctly
- Confirm reward is still active

**Admin can't access dashboard**
- Verify admin account is active
- Check credentials
- Review audit logs for lockout

## Future Enhancements

Potential future features:
- Mobile app integration
- Push notifications for rewards
- Birthday bonuses
- Referral program
- Social media integration
- Advanced analytics dashboard
- Automated marketing campaigns
- Customer segmentation
- A/B testing for promotions
- Multi-location support

## Conclusion

This enterprise-grade loyalty system provides all the tools needed to run a successful customer rewards program. With comprehensive admin controls, secure customer management, and detailed analytics, it's ready for production use from day one.

For technical support or feature requests, contact your development team.
