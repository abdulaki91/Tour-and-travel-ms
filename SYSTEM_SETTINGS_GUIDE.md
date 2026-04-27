# System Settings Implementation Guide

## Overview

The System Settings feature allows administrators to configure various aspects of the East Hararghe Tours platform through a centralized interface. Settings are stored in the database and applied throughout the application in real-time.

## Features

### ✅ Implemented Features

1. **Database-backed Settings Storage**
   - All settings stored in `system_settings` table
   - Type-safe storage (string, number, boolean, json)
   - Categorized settings for better organization

2. **Admin Interface**
   - User-friendly settings management page
   - Organized into tabs: General, System, Notifications, Security, Content
   - Real-time validation and feedback
   - Unsaved changes indicator

3. **System-wide Enforcement**
   - Middleware-based enforcement
   - Settings cache for performance (1-minute TTL)
   - Automatic cache invalidation on updates

4. **Settings Categories**

   **General Settings:**
   - Site Name
   - Site Description
   - Contact Email
   - Contact Phone

   **System Settings:**
   - Maintenance Mode (blocks non-admin access)
   - User Registration (enable/disable new registrations)
   - Booking System (enable/disable booking creation)
   - Payment Processing (enable/disable payments)

   **Notification Settings:**
   - Email Notifications
   - SMS Notifications
   - Push Notifications

   **Content Settings:**
   - Max Upload Size (MB)
   - Allowed File Types
   - Max Images Per Package

   **Booking Settings:**
   - Minimum Booking Advance Days
   - Maximum Booking Advance Days
   - Cancellation Deadline Hours
   - Auto-confirm Bookings

   **Payment Settings:**
   - Currency
   - Payment Gateway
   - Commission Rate (%)
   - Refund Processing Days

   **Security Settings:**
   - Session Timeout Minutes
   - Max Login Attempts
   - Password Minimum Length
   - Require Email Verification

## Database Schema

```sql
CREATE TABLE system_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key),
  INDEX idx_category (category)
);
```

## API Endpoints

### Get All Settings

```
GET /api/admin/settings
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "site_name": "East Hararghe Tours",
    "maintenance_mode": false,
    "registration_enabled": true,
    ...
  }
}
```

### Update Settings

```
POST /api/admin/settings
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "maintenance_mode": true,
  "registration_enabled": false,
  "site_name": "New Site Name"
}

Response:
{
  "success": true,
  "message": "Settings updated successfully",
  "data": { ... }
}
```

## Middleware Usage

### Maintenance Mode Check

Automatically applied to all routes except:

- `/api/health`
- `/api/admin/*` (admin routes)
- Requests from admin users

```javascript
// Applied in app.js
app.use(checkMaintenanceMode);
```

### Registration Check

Applied to registration endpoint:

```javascript
// In authRoutes.js
router.post("/register", checkRegistrationEnabled, ...);
```

### Booking Check

Applied to booking creation:

```javascript
// In bookingRoutes.js
router.post("/", authenticate, authorize("USER"), checkBookingEnabled, ...);
```

### Payment Check

Applied to payment endpoints:

```javascript
// In paymentRoutes.js
router.post("/booking/:bookingId", authenticate, checkPaymentEnabled, ...);
```

## Backend Service Methods

### AdminService Methods

```javascript
// Get all settings
const settings = await AdminService.getSettings();

// Get single setting
const value = await AdminService.getSetting("maintenance_mode");

// Update multiple settings
const updated = await AdminService.updateSettings({
  maintenance_mode: true,
  registration_enabled: false,
});

// Update single setting
await AdminService.updateSetting("maintenance_mode", true);
```

### Settings Cache

```javascript
import {
  getSystemSettings,
  clearSettingsCache,
} from "../middlewares/systemSettings.js";

// Get cached settings
const settings = await getSystemSettings();

// Clear cache (automatically called on update)
clearSettingsCache();
```

## Frontend Integration

### Admin Settings Page

Located at: `frontend/src/pages/admin/AdminSettings.tsx`

Features:

- Tab-based navigation
- Real-time change tracking
- Unsaved changes warning
- Form validation
- Success/error notifications

### Using Settings in Components

```typescript
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../services/admin";

const { data } = useQuery({
  queryKey: ["admin-settings"],
  queryFn: adminService.getSettings,
});

const settings = data?.data;
```

## Testing

### Run System Settings Test

```bash
node api/src/scripts/testSystemSettings.js
```

This test verifies:

- ✅ Fetching all settings
- ✅ Fetching single setting
- ✅ Updating single setting
- ✅ Updating multiple settings
- ✅ Settings persistence

### Manual Testing Checklist

1. **Maintenance Mode**
   - [ ] Enable maintenance mode
   - [ ] Try accessing site as regular user (should be blocked)
   - [ ] Try accessing site as admin (should work)
   - [ ] Disable maintenance mode
   - [ ] Verify regular users can access again

2. **Registration Control**
   - [ ] Disable registration
   - [ ] Try to register new user (should fail)
   - [ ] Enable registration
   - [ ] Register new user (should succeed)

3. **Booking Control**
   - [ ] Disable bookings
   - [ ] Try to create booking (should fail)
   - [ ] Enable bookings
   - [ ] Create booking (should succeed)

4. **Payment Control**
   - [ ] Disable payments
   - [ ] Try to process payment (should fail)
   - [ ] Enable payments
   - [ ] Process payment (should succeed)

5. **Settings Persistence**
   - [ ] Update settings
   - [ ] Restart server
   - [ ] Verify settings are still applied

## Performance Considerations

1. **Caching Strategy**
   - Settings cached for 1 minute
   - Reduces database queries
   - Cache cleared on updates

2. **Middleware Optimization**
   - Settings fetched once per request
   - Attached to request object for reuse
   - Graceful fallback if settings unavailable

## Security Considerations

1. **Admin-Only Access**
   - Only admins can view/update settings
   - Protected by authentication middleware
   - Role-based authorization enforced

2. **Input Validation**
   - Type checking on updates
   - Prevents invalid setting values
   - Transaction-based updates

3. **Audit Trail**
   - `updated_at` timestamp tracked
   - Can be extended to log who made changes

## Future Enhancements

### Planned Features

1. **Settings History**
   - Track all setting changes
   - Show who made changes and when
   - Ability to rollback changes

2. **Setting Groups**
   - Group related settings
   - Bulk enable/disable groups
   - Import/export setting groups

3. **Advanced Validation**
   - Custom validation rules per setting
   - Dependency checking (e.g., can't disable payments if bookings enabled)
   - Warning messages for risky changes

4. **Real-time Updates**
   - WebSocket notifications when settings change
   - Auto-refresh affected pages
   - Show banner when settings change

5. **Environment-specific Settings**
   - Different settings per environment
   - Development vs Production configs
   - Easy environment switching

## Troubleshooting

### Settings Not Taking Effect

1. Check cache expiration (wait 1 minute or restart server)
2. Verify database connection
3. Check middleware order in app.js
4. Review server logs for errors

### Database Migration Issues

```bash
# Re-run migration
node api/src/scripts/createSystemSettingsTable.js
```

### Cache Issues

```javascript
// Manually clear cache
import { clearSettingsCache } from "../middlewares/systemSettings.js";
clearSettingsCache();
```

## Support

For issues or questions:

- Check server logs: `api/logs/`
- Review database: `SELECT * FROM system_settings;`
- Test settings: `node api/src/scripts/testSystemSettings.js`

## Conclusion

The System Settings feature provides a robust, database-backed configuration system that allows administrators to control various aspects of the platform without code changes. The implementation includes proper caching, middleware enforcement, and a user-friendly admin interface.
