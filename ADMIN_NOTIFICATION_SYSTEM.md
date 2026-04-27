# Admin Notification System

## Overview

Admins now receive real-time notifications for high-priority events that require oversight or action.

## Notification Types

### 1. **New Company Registration** 🏢

**When:** A user registers a new company
**Type:** `info`
**Message Format:**

```
Title: New Company Registration
Message: {company_name} has registered and is awaiting verification.
         Owner: {owner_name} ({owner_email})
```

**Action Required:** Admin should verify the company in Admin → Companies page

---

### 2. **Large Booking Alert** 💰

**When:** A booking exceeds 10,000 ETB
**Type:** `warning`
**Message Format:**

```
Title: Large Booking Alert
Message: High-value booking received: {package_title} - {total_amount} ETB
         by {customer_name}. Reference: {booking_reference}
```

**Action Required:** Monitor for potential fraud or issues

---

### 3. **Refund Request** 💸

**When:** A company processes a refund for a booking
**Type:** `warning`
**Message Format:**

```
Title: Refund Request
Message: Refund requested for booking {booking_reference} - {amount} ETB.
         Customer: {customer_name}
```

**Action Required:** Review refund for legitimacy

---

### 4. **Payment Failure Alert** ❌

**When:** A payment fails during processing
**Type:** `error`
**Message Format:**

```
Title: Payment Failure Alert
Message: Payment failed for booking {booking_reference} - {amount} ETB.
         Reason: {failure_reason}
```

**Action Required:** Investigate payment gateway issues

---

### 5. **Suspicious Activity** ⚠️

**When:** System detects unusual patterns
**Type:** `error`
**Message Format:**

```
Title: Suspicious Activity Detected
Message: {description}. User: {user_email}
```

**Action Required:** Investigate and take appropriate action

---

### 6. **System Error** 🔴

**When:** Critical system errors occur
**Type:** `error`
**Message Format:**

```
Title: System Error
Message: {error_type}: {message}. Location: {location}
```

**Action Required:** Technical investigation required

---

## Implementation Details

### Backend Methods

All admin notification methods are in `api/src/services/notificationService.js`:

```javascript
// Notify all admins
NotificationService.notifyAllAdmins({ title, message, type });

// Specific event notifications
NotificationService.notifyAdminsNewCompanyRegistration(companyData);
NotificationService.notifyAdminsLargeBooking(bookingData);
NotificationService.notifyAdminsRefundRequest(refundData);
NotificationService.notifyAdminsPaymentFailure(paymentData);
NotificationService.notifyAdminsSuspiciousActivity(activityData);
NotificationService.notifyAdminsSystemError(errorData);
```

### Integration Points

1. **Company Registration** (`api/src/services/companyService.js`)
   - Triggers: `notifyAdminsNewCompanyRegistration()`
   - When: User completes company registration form

2. **Large Bookings** (`api/src/services/bookingService.js`)
   - Triggers: `notifyAdminsLargeBooking()`
   - When: Booking amount ≥ 10,000 ETB
   - Threshold configurable via `LARGE_BOOKING_THRESHOLD`

3. **Refunds** (`api/src/services/bookingService.js`)
   - Triggers: `notifyAdminsRefundRequest()`
   - When: Company processes a refund

4. **Payment Failures** (To be implemented in payment service)
   - Triggers: `notifyAdminsPaymentFailure()`
   - When: Payment processing fails

---

## Configuration

### Large Booking Threshold

Located in `api/src/services/bookingService.js`:

```javascript
const LARGE_BOOKING_THRESHOLD = 10000; // ETB
```

Adjust this value based on your business needs.

---

## Admin Dashboard

Admins can view all notifications in:

- **Admin → Notifications** page
- Real-time notifications via WebSocket
- Notification bell icon in header

### Notification Filters

- By type (info, success, warning, error)
- By read/unread status
- By date range
- Search by content

---

## Future Enhancements

### Potential Additions:

1. **Email notifications** for critical events
2. **SMS alerts** for urgent issues
3. **Notification preferences** per admin
4. **Escalation rules** for unread critical notifications
5. **Notification digest** (daily/weekly summary)
6. **Custom notification rules** via admin panel

### Additional Event Types:

- Multiple failed login attempts
- Unusual booking patterns
- Review disputes
- Package approval requests
- User account suspensions
- Data export requests

---

## Testing

### Manual Testing:

1. **Company Registration:**
   - Register a new company as a user
   - Check admin notifications page

2. **Large Booking:**
   - Create a booking with amount ≥ 10,000 ETB
   - Check admin notifications

3. **Refund:**
   - Process a refund as a company
   - Check admin notifications

### Automated Testing:

```javascript
// Test admin notification creation
const result = await NotificationService.notifyAdminsNewCompanyRegistration({
  company_name: "Test Company",
  owner_name: "Test Owner",
  owner_email: "test@example.com",
});

console.log(`Created ${result.length} admin notifications`);
```

---

## Troubleshooting

### No notifications received:

1. Check if admin users exist with role 'ADMIN'
2. Verify admin users are active (`is_active = true`)
3. Check backend logs for notification errors
4. Verify WebSocket connection for real-time updates

### Duplicate notifications:

1. Check if multiple admin users exist
2. This is expected - each admin receives their own notification

---

## Security Considerations

- Notifications contain minimal sensitive data
- Full details available only in admin panel
- Notifications are user-specific (not shared)
- Real-time updates use authenticated WebSocket connections

---

## Performance

- Notifications are created asynchronously (non-blocking)
- Failed notifications don't affect main operations
- Errors are logged but don't throw exceptions
- Database queries are optimized with indexes

---

## Maintenance

### Regular Tasks:

1. **Archive old notifications** (>90 days)
2. **Monitor notification volume**
3. **Review notification effectiveness**
4. **Update thresholds** based on business growth

### Monitoring:

- Track notification creation rate
- Monitor admin response times
- Analyze notification types distribution
- Review false positive rates

---

## Support

For issues or questions:

1. Check backend logs: `api/logs/`
2. Review notification service code
3. Test with manual notification creation
4. Contact development team

---

**Last Updated:** 2026-04-27
**Version:** 1.0.0
