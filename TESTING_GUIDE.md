# East Hararghe Tour & Travel - Testing Guide

## Quick Start Testing

### 1. Start the Backend

```bash
cd api
npm start
```

Backend should be running on http://localhost:5002

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend should be running on http://localhost:5173

### 3. Test Credentials

#### Admin User

- **Email**: `admin@easthararghetours.com`
- **Password**: `password123`
- **Access**: Admin dashboard, user management, company management

#### Company User

- **Email**: `harar@culturaltours.com`
- **Password**: `password123`
- **Access**: Company dashboard, package management, bookings

#### Regular User

- **Email**: `mohammed.ali@email.com`
- **Password**: `password123`
- **Access**: User dashboard, bookings, profile

### 4. Testing Flow

1. **Login Test**:
   - Go to http://localhost:5173/login
   - Use any of the test credentials above
   - Should redirect to appropriate dashboard based on role

2. **Navigation Test**:
   - Check sidebar navigation works
   - Verify role-based menu items

3. **Data Loading Test**:
   - User dashboard should show stats and recent bookings
   - Company dashboard should show packages and bookings
   - Admin dashboard should show system stats

4. **API Integration Test**:
   - Check browser console for API requests
   - Verify no 401/403 errors
   - Check that data is loading properly

### 5. Debug Information

- **Debug Auth Component**: Shows current auth state in bottom-right corner (development only)
- **Browser Console**: Check for API requests and any errors
- **Network Tab**: Verify API calls are being made to http://localhost:5002/api

### 6. Common Issues & Solutions

#### "Access Denied" Error

- Clear localStorage: `localStorage.clear()`
- Try logging in again
- Check if backend is running

#### Empty Pages/No Data

- Check browser console for API errors
- Verify backend is running on port 5002
- Check if database is connected

#### Navigation Not Working

- Check browser console for routing errors
- Verify all required pages exist
- Check if user has proper role permissions

### 7. Database Status

The database has been seeded with:

- ✅ 11 users (admin, company, regular users)
- ✅ 5 companies
- ✅ 6 packages
- ✅ 5 bookings
- ✅ 5 payments
- ✅ 3 reviews
- ✅ 5 notifications

### 8. API Endpoints Available

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/users/stats` - User statistics
- `GET /api/bookings/my` - User bookings
- `GET /api/admin/stats` - Admin statistics
- And many more...

## Next Steps

After testing, you can:

1. Customize the UI/UX
2. Add more features
3. Deploy to production
4. Add more test data
5. Implement additional payment gateways
