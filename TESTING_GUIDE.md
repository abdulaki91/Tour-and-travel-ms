# East Hararghe Tour & Travel Management System - Complete Testing Guide

## 🎯 Overview

This guide provides comprehensive testing procedures for all user roles and functionalities in the East Hararghe Tour & Travel Management System.

## 📋 Prerequisites

1. Backend server running on `http://localhost:5002`
2. Frontend server running on `http://localhost:5174`
3. Database seeded with test data (run `npm run seed` in the api folder)

---

## 👥 Test User Accounts

### 🔑 Universal Password

**All test accounts use the same password: `password123`**

### 1. Admin User

- **Email**: `admin@easthararghetours.com`
- **Password**: `password123`
- **Name**: System Administrator
- **Phone**: +251911234567
- **Role**: Admin

### 2. Company Users (Tour Operators)

#### Company 1: Harar Cultural Tours

- **Email**: `harar@culturaltours.com`
- **Password**: `password123`
- **Name**: Ahmed Mohammed
- **Phone**: +251912345678
- **Company**: Harar Cultural Tours

#### Company 2: Dire Dawa Adventure Tours

- **Email**: `dire@adventuretours.com`
- **Password**: `password123`
- **Name**: Fatuma Hassan
- **Phone**: +251913456789
- **Company**: Dire Dawa Adventure Tours

#### Company 3: Babille Eco Tours

- **Email**: `babille@ecotours.com`
- **Password**: `password123`
- **Name**: Abdi Kedir
- **Phone**: +251914567890
- **Company**: Babille Eco Tours

#### Company 4: Kombolcha Heritage Tours

- **Email**: `kombolcha@heritagetours.com`
- **Password**: `password123`
- **Name**: Meron Tadesse
- **Phone**: +251915678901
- **Company**: Kombolcha Heritage Tours

#### Company 5: Fedis Nature Tours

- **Email**: `fedis@naturetours.com`
- **Password**: `password123`
- **Name**: Yusuf Ibrahim
- **Phone**: +251916789012
- **Company**: Fedis Nature Tours

### 3. Regular Users (Customers)

#### Customer 1

- **Email**: `mohammed.ali@email.com`
- **Password**: `password123`
- **Name**: Mohammed Ali
- **Phone**: +251917123456
- **Status**: Has active bookings

#### Customer 2

- **Email**: `hanan.ahmed@email.com`
- **Password**: `password123`
- **Name**: Hanan Ahmed
- **Phone**: +251918234567
- **Status**: Has confirmed bookings

#### Customer 3

- **Email**: `dawit.tesfaye@email.com`
- **Password**: `password123`
- **Name**: Dawit Tesfaye
- **Phone**: +251919345678
- **Status**: Has completed bookings

#### Customer 4

- **Email**: `sara.mohammed@email.com`
- **Password**: `password123`
- **Name**: Sara Mohammed
- **Phone**: +251920456789
- **Status**: Has confirmed bookings

#### Customer 5

- **Email**: `yonas.bekele@email.com`
- **Password**: `password123`
- **Name**: Yonas Bekele
- **Phone**: +251921567890
- **Status**: Has pending bookings

---

## 🧪 Testing Procedures by User Role

## 1. 👤 Customer/User Testing

### Step 1: Registration & Login Testing

1. **Test New User Registration**
   - Go to `/register`
   - Fill form with new user data:
     - Name: `Test User`
     - Email: `testuser@email.com`
     - Password: `password123`
     - Phone: `+251922123456` (optional)
   - Click "Create Account"
   - Verify success message and redirect to login

2. **Test User Login**
   - Go to `/login`
   - Use any customer credentials above
   - Verify successful login and redirect to dashboard

### Step 2: Browse Packages

1. **View All Packages**
   - Go to `/packages`
   - Verify 6 packages are displayed
   - Test search functionality
   - Test filter by location/price

2. **View Package Details**
   - Click on any package (e.g., "5-Day Harar Cultural Heritage Experience")
   - Verify all details are displayed:
     - Title, description, location
     - Duration, price, availability
     - Itinerary, includes/excludes
     - Images, company info

### Step 3: Booking Process

1. **Create New Booking**
   - From package details page, click "Book Now"
   - Fill booking form:
     - Travel Date: Future date
     - Number of People: 2
     - Special Requests: "Vegetarian meals preferred"
   - Submit booking
   - Verify booking confirmation

### Step 4: User Dashboard Testing

1. **Access Dashboard**
   - Login as `mohammed.ali@email.com`
   - Go to `/user/dashboard`
   - Verify dashboard displays:
     - Welcome message
     - Booking statistics
     - Recent bookings
     - Quick actions

### Step 5: My Bookings Testing

1. **View All Bookings**
   - Go to `/user/bookings`
   - Verify existing bookings are displayed
   - Test filter by status (Confirmed, Pending, Completed, Cancelled)
   - Test filter by payment status

2. **View Booking Details**
   - Click "View Details" on any booking
   - Verify booking information is displayed
   - Test cancel booking (for pending bookings)

### Step 6: Profile Management

1. **View Profile**
   - Go to `/user/profile`
   - Verify user information is displayed
   - Test edit profile functionality

---

## 2. 🏢 Company/Tour Operator Testing

### Step 1: Company Login

1. **Login as Company User**
   - Use `harar@culturaltours.com` / `password123`
   - Verify redirect to company dashboard

### Step 2: Company Dashboard

1. **Dashboard Overview**
   - Go to `/company/dashboard`
   - Verify dashboard displays:
     - Company statistics
     - Recent bookings
     - Package performance
     - Quick actions

### Step 3: Package Management

1. **View My Packages**
   - Go to `/company/packages`
   - Verify packages are displayed in modern table
   - Check statistics cards (Total, Active, Inactive, Reviews)

2. **Package Actions**
   - Test "View" package (opens package details)
   - Test "Edit" package (if edit page exists)
   - Test "Activate/Deactivate" package
   - Test "Delete" package (with confirmation modal)

3. **Create New Package**
   - Click "Create Package"
   - Fill package creation form (if available)
   - Test form validation

### Step 4: Booking Management

1. **View Customer Bookings**
   - Go to `/company/bookings`
   - Verify bookings for company packages are displayed
   - Test booking status updates
   - Test booking filters

### Step 5: Test Different Companies

1. **Test Each Company Account**
   - Login as each company user
   - Verify they see only their own packages
   - Verify company-specific data isolation

---

## 3. 👨‍💼 Admin Testing

### Step 1: Admin Login

1. **Login as Admin**
   - Use `admin@easthararghetours.com` / `password123`
   - Verify redirect to admin dashboard

### Step 2: Admin Dashboard

1. **Dashboard Overview**
   - Go to `/admin/dashboard`
   - Verify comprehensive system statistics:
     - Total users, companies, packages
     - Revenue statistics
     - System health indicators
     - Quick action buttons

### Step 3: User Management

1. **Manage Users**
   - Go to `/admin/users`
   - Verify user management interface
   - Test user actions (if implemented)

### Step 4: Company Management

1. **Manage Companies**
   - Go to `/admin/companies`
   - Verify company management interface
   - Test company approval/rejection (if implemented)

---

## 📦 Available Test Packages

### Package 1: 5-Day Harar Cultural Heritage Experience

- **Company**: Harar Cultural Tours
- **Price**: $850
- **Duration**: 5 days
- **Max People**: 12
- **Available Slots**: 8

### Package 2: 4-Day Dire Dawa Cave & Nature Adventure

- **Company**: Dire Dawa Adventure Tours
- **Price**: $680
- **Duration**: 4 days
- **Max People**: 10
- **Available Slots**: 7

### Package 3: 3-Day Babille Elephant Sanctuary Experience

- **Company**: Babille Eco Tours
- **Price**: $750
- **Duration**: 3 days
- **Max People**: 8
- **Available Slots**: 5

### Package 4: 4-Day East Hararghe Historical Circuit

- **Company**: Kombolcha Heritage Tours
- **Price**: $620
- **Duration**: 4 days
- **Max People**: 12
- **Available Slots**: 9

### Package 5: 6-Day Coffee Origin & Highland Experience

- **Company**: Fedis Nature Tours
- **Price**: $920
- **Duration**: 6 days
- **Max People**: 10
- **Available Slots**: 8

### Package 6: 7-Day Complete East Hararghe Discovery

- **Company**: Harar Cultural Tours
- **Price**: $1,450
- **Duration**: 7 days
- **Max People**: 8
- **Available Slots**: 4

---

## 🧪 Specific Test Scenarios

### Scenario 1: Complete Customer Journey

1. Register new customer account
2. Browse and search packages
3. View package details
4. Create booking
5. View booking in dashboard
6. Check booking status
7. Leave review (if completed)

### Scenario 2: Company Package Management

1. Login as company user
2. View package statistics
3. Create new package
4. Edit existing package
5. Activate/deactivate package
6. Delete package
7. View customer bookings

### Scenario 3: Admin System Overview

1. Login as admin
2. View system statistics
3. Monitor user activity
4. Manage companies
5. View system health
6. Export reports (if available)

### Scenario 4: Multi-User Interaction

1. Customer creates booking
2. Company receives booking notification
3. Company confirms booking
4. Customer receives confirmation
5. Admin monitors transaction

---

## 🔍 Testing Checklist

### ✅ Authentication & Authorization

- [ ] User registration works
- [ ] User login works
- [ ] Password validation works
- [ ] Role-based access control works
- [ ] Logout functionality works

### ✅ User Interface

- [ ] Modern design is consistent
- [ ] Responsive design works on mobile
- [ ] Navigation is intuitive
- [ ] Forms are user-friendly
- [ ] Error messages are clear

### ✅ Package Management

- [ ] Package listing works
- [ ] Package details display correctly
- [ ] Package search/filter works
- [ ] Package CRUD operations work (companies)
- [ ] Package status management works

### ✅ Booking System

- [ ] Booking creation works
- [ ] Booking listing works
- [ ] Booking status updates work
- [ ] Booking cancellation works
- [ ] Booking filters work

### ✅ Dashboard Functionality

- [ ] User dashboard displays correctly
- [ ] Company dashboard shows relevant data
- [ ] Admin dashboard shows system overview
- [ ] Statistics are accurate
- [ ] Quick actions work

### ✅ Data Integrity

- [ ] User data isolation works
- [ ] Company data isolation works
- [ ] Booking data consistency
- [ ] Payment data accuracy
- [ ] Review data integrity

---

## 🚨 Common Issues to Test

### 1. Authentication Issues

- Invalid credentials
- Expired sessions
- Role access violations
- Password reset functionality

### 2. Data Validation

- Required field validation
- Email format validation
- Phone number validation
- Date validation
- Price validation

### 3. Error Handling

- Network errors
- Server errors
- Validation errors
- Not found errors
- Permission errors

### 4. Performance

- Page load times
- Large data sets
- Concurrent users
- Database queries

---

## 📊 Expected Test Results

### User Registration/Login

- ✅ New users can register successfully
- ✅ Existing users can login
- ✅ Invalid credentials are rejected
- ✅ Users are redirected to appropriate dashboards

### Package Browsing

- ✅ All 6 packages are visible
- ✅ Package details are complete
- ✅ Search and filters work
- ✅ Images and descriptions display

### Booking Process

- ✅ Bookings can be created
- ✅ Booking confirmations are sent
- ✅ Booking status updates work
- ✅ Payment integration works (if implemented)

### Dashboard Functionality

- ✅ Role-specific dashboards display
- ✅ Statistics are accurate
- ✅ Recent activity shows
- ✅ Quick actions work

---

## 🔧 Troubleshooting

### If Login Fails

1. Verify backend server is running on port 5002
2. Check database connection
3. Verify user exists in database
4. Check password hashing

### If Packages Don't Display

1. Verify database is seeded
2. Check API endpoints
3. Verify frontend-backend connection
4. Check console for errors

### If Bookings Don't Work

1. Check user authentication
2. Verify package availability
3. Check booking validation
4. Verify database constraints

---

## 📝 Test Report Template

### Test Session Information

- **Date**: ****\_\_\_****
- **Tester**: ****\_\_\_****
- **Environment**: Development/Staging/Production
- **Browser**: ****\_\_\_****

### Test Results

| Feature           | Status | Notes |
| ----------------- | ------ | ----- |
| User Registration | ✅/❌  |       |
| User Login        | ✅/❌  |       |
| Package Browsing  | ✅/❌  |       |
| Booking Creation  | ✅/❌  |       |
| Dashboard Access  | ✅/❌  |       |
| Company Features  | ✅/❌  |       |
| Admin Features    | ✅/❌  |       |

### Issues Found

1. **Issue**: ****\_\_\_****
   - **Severity**: High/Medium/Low
   - **Steps to Reproduce**: ****\_\_\_****
   - **Expected Result**: ****\_\_\_****
   - **Actual Result**: ****\_\_\_****

### Recommendations

- ***
- ***
- ***

---

## 🎯 Success Criteria

The system passes testing if:

- ✅ All user roles can login successfully
- ✅ Package browsing and details work correctly
- ✅ Booking process completes without errors
- ✅ Dashboards display appropriate data
- ✅ Company users can manage their packages
- ✅ Admin users can view system overview
- ✅ Modern UI design is consistent throughout
- ✅ Responsive design works on different screen sizes
- ✅ Error handling provides clear feedback
- ✅ Data integrity is maintained across operations

---

**Happy Testing! 🚀**

For any issues or questions during testing, please document them with:

1. Steps to reproduce
2. Expected vs actual behavior
3. Browser and environment details
4. Screenshots if applicable
