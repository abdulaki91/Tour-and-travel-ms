# East Hararghe Tour & Travel Management System - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Backend Setup

1. **Navigate to the API directory:**

   ```bash
   cd api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `api` directory with the following variables:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=tour_travel_db
   DB_PORT=3306

   # Server Configuration
   PORT=5002
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Payment Gateway Configuration (Mock for development)
   TELEBIRR_MERCHANT_ID=your_telebirr_merchant_id
   TELEBIRR_SECRET_KEY=your_telebirr_secret_key
   TELEBIRR_WEBHOOK_SECRET=your_telebirr_webhook_secret
   CHAPA_SECRET_KEY=your_chapa_secret_key
   CHAPA_WEBHOOK_SECRET=your_chapa_webhook_secret

   # API Base URL
   API_BASE_URL=http://localhost:5002
   ```

4. **Set up MySQL database:**
   - Start your MySQL server
   - Create a database named `tour_travel_db` (or use the name specified in your .env file)
   - The application will automatically create the required tables on first run

5. **Run database migrations (optional):**

   ```bash
   node src/scripts/updateDatabase.js
   ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

   The API server will start on `http://localhost:5002`

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_API_URL=http://localhost:5002/api
   VITE_SOCKET_URL=http://localhost:5002
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## Features Completed

### Backend Features:

- ✅ Complete user authentication and authorization
- ✅ User profile management with notification preferences
- ✅ Company registration and verification system
- ✅ Package management (CRUD operations)
- ✅ Booking system with status tracking
- ✅ Payment integration (Telebirr, Chapa, Bank Transfer)
- ✅ Review and rating system
- ✅ Real-time notifications via Socket.io
- ✅ Admin panel with comprehensive management tools
- ✅ Report generation and export functionality
- ✅ Payment verification and refund processing
- ✅ Webhook support for payment gateways
- ✅ System health monitoring

### Frontend Features:

- ✅ Responsive design with modern UI
- ✅ User dashboard with statistics and recent bookings
- ✅ Company dashboard with package and booking management
- ✅ Admin panel with user, company, and review management
- ✅ Complete payment flow with multiple payment methods
- ✅ Real-time notifications
- ✅ Profile management for all user types
- ✅ Package browsing and booking system
- ✅ Review and rating interface

## User Roles

1. **Regular Users (USER)**
   - Browse and book tour packages
   - Manage bookings and payments
   - Leave reviews and ratings
   - Update profile and notification preferences

2. **Travel Companies (COMPANY)**
   - Create and manage tour packages
   - View and manage bookings
   - Track revenue and statistics
   - Update company profile

3. **System Administrators (ADMIN)**
   - Manage all users and companies
   - Verify company registrations
   - Moderate reviews and content
   - Generate reports and analytics
   - Monitor system health

## Default Admin Account

After running the database initialization, you can create an admin account by:

1. Registering a regular user account
2. Manually updating the user's role_id to 3 in the database
3. Or use the seeder script if available

## Production Deployment

For production deployment:

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Use strong JWT secrets
   - Configure real payment gateway credentials
   - Set up proper database credentials

2. **Database:**
   - Use a production MySQL instance
   - Set up proper backup strategies
   - Configure connection pooling

3. **Security:**
   - Enable HTTPS
   - Configure proper CORS origins
   - Set up rate limiting
   - Use environment-specific secrets

4. **Monitoring:**
   - Set up logging
   - Monitor system health endpoints
   - Configure error tracking

## API Documentation

The API includes the following main endpoints:

- `/api/auth/*` - Authentication and registration
- `/api/users/*` - User profile management
- `/api/packages/*` - Package management
- `/api/bookings/*` - Booking operations
- `/api/payments/*` - Payment processing
- `/api/reviews/*` - Review system
- `/api/notifications/*` - Notification management
- `/api/admin/*` - Administrative functions

## Support

For issues or questions:

1. Check the console logs for error messages
2. Ensure all environment variables are properly set
3. Verify database connection and schema
4. Check that all required dependencies are installed

The system is now production-ready with comprehensive features for managing a tour and travel business.
