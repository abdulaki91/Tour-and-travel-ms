# Socket.IO Real-Time Notification System

## Overview

The East Hararghe Tour & Travel Management System now includes a comprehensive real-time notification system using Socket.IO. This system provides instant notifications for bookings, payments, and other important events.

## Features

### ✅ Backend Implementation

- **Socket.IO Server**: Fully configured with authentication middleware
- **Real-time Events**: Booking updates, payment notifications, system announcements
- **User Authentication**: JWT-based socket authentication
- **Role-based Rooms**: Users automatically join role-specific rooms
- **Notification Service**: Complete CRUD operations for notifications
- **Database Integration**: Notifications stored in MySQL database

### ✅ Frontend Implementation

- **Socket Context**: React context for managing socket connections
- **Notification Components**: Bell icon, dropdown, and full page view
- **Real-time Updates**: Instant notification display and unread count updates
- **Toast Notifications**: Visual feedback for new notifications
- **Notification Management**: Mark as read, delete, filter notifications

### ✅ Integration Points

- **Booking Workflow**: Notifications sent on booking creation, confirmation, cancellation
- **Payment Workflow**: Notifications sent on payment success/failure
- **Company Notifications**: Companies notified of new bookings
- **Admin Notifications**: System-wide announcements

## Architecture

### Backend Components

```
api/src/
├── socket/
│   └── index.js                 # Socket.IO server configuration
├── services/
│   └── notificationService.js   # Notification business logic
├── controllers/
│   └── notificationController.js # HTTP API endpoints
├── routes/
│   └── notificationRoutes.js    # REST API routes
└── scripts/
    └── testSocket.js            # Testing script
```

### Frontend Components

```
frontend/src/
├── context/
│   └── SocketContext.tsx        # Socket connection management
├── components/
│   └── notifications/
│       ├── NotificationBell.tsx     # Bell icon with unread count
│       ├── NotificationDropdown.tsx # Quick notification view
│       └── NotificationItem.tsx     # Individual notification
├── pages/
│   └── NotificationsPage.tsx    # Full notification management
└── services/
    └── notifications.ts         # API service functions
```

## Socket Events

### Client → Server Events

- `notification_read`: Mark notification as read
- `mark_all_notifications_read`: Mark all notifications as read
- `get_unread_count`: Request current unread count
- `typing_start/stop`: Typing indicators (for future chat)

### Server → Client Events

- `new_notification`: New notification received
- `unread_count_updated`: Updated unread count
- `booking_update`: Booking status changed
- `payment_update`: Payment status changed
- `system_announcement`: System-wide announcements
- `connection_confirmed`: Connection established

## API Endpoints

### Notification REST API

- `GET /api/notifications` - Get user notifications (paginated)
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Database Schema

### Notifications Table

```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Notification Types

- `welcome` - Welcome message for new users
- `booking_confirmed` - Booking confirmation
- `booking_cancelled` - Booking cancellation
- `booking_status` - General booking status updates
- `new_booking` - New booking for companies
- `payment_completed` - Successful payment
- `payment_failed` - Failed payment
- `package_status` - Package status updates
- `system_maintenance` - System announcements

## Usage Examples

### Creating Notifications (Backend)

```javascript
// Welcome notification
await NotificationService.createNotification(userId, {
  title: "Welcome!",
  message: "Welcome to East Hararghe Tours",
  type: "welcome",
});

// Booking confirmation
await NotificationService.notifyBookingConfirmed(userId, {
  package_title: "Harar Cultural Tour",
  booking_reference: "BK-001",
});
```

### Using Socket Context (Frontend)

```tsx
const { socket, isConnected, unreadCount, markNotificationAsRead } =
  useSocket();

// Mark notification as read
markNotificationAsRead(notificationId);
```

## Testing

### Backend Testing

```bash
# Run socket notification tests
cd api
npm run test-socket
```

### Frontend Testing

1. Start backend server: `npm run dev`
2. Start frontend server: `npm run dev`
3. Login with test credentials
4. Check browser console for socket connection logs
5. Trigger actions (bookings, payments) to see notifications

## Configuration

### Environment Variables

```env
# Backend (.env)
FRONTEND_URL=http://localhost:5174
PORT=5002

# Frontend (.env)
VITE_API_URL=http://localhost:5002
```

### CORS Configuration

The backend is configured to accept connections from:

- http://localhost:3000
- http://localhost:5173
- http://localhost:5174

## Security Features

- **JWT Authentication**: All socket connections require valid JWT tokens
- **User Isolation**: Users only receive their own notifications
- **Role-based Access**: Different notification types for different user roles
- **Input Validation**: All notification data is validated before processing

## Performance Considerations

- **Connection Pooling**: Database connections are pooled for efficiency
- **Event Throttling**: Socket events are properly managed to prevent spam
- **Memory Management**: Socket connections are cleaned up on disconnect
- **Error Handling**: Comprehensive error handling prevents crashes

## Monitoring

### Connection Status

- Real-time connection count available via `getConnectionCount()`
- Connected users list via `getConnectedUsers()`
- Connection logs in server console

### Notification Metrics

- Unread notification counts per user
- Notification delivery status
- Failed notification attempts logged

## Future Enhancements

### Planned Features

- [ ] Push notifications for mobile apps
- [ ] Email notification fallback
- [ ] Notification preferences per user
- [ ] Chat system using existing socket infrastructure
- [ ] File sharing notifications
- [ ] Bulk notification system for admins

### Scalability

- [ ] Redis adapter for multi-server deployments
- [ ] Message queuing for high-volume notifications
- [ ] Notification archiving system
- [ ] Analytics dashboard for notification metrics

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Check CORS configuration
   - Verify JWT token is valid
   - Ensure backend server is running

2. **Notifications Not Appearing**
   - Check browser console for errors
   - Verify user is authenticated
   - Check notification service logs

3. **Database Errors**
   - Ensure notifications table exists
   - Check foreign key constraints
   - Verify database connection

### Debug Commands

```bash
# Check socket connection
console.log("Socket connected:", socket.connected);

# Check unread count
socket.emit("get_unread_count");

# Test notification creation (backend)
npm run test-socket
```

## Support

For issues or questions about the Socket.IO implementation:

1. Check the browser console for client-side errors
2. Check server logs for backend errors
3. Run the test script to verify functionality
4. Review this documentation for configuration details

---

**Status**: ✅ Fully Implemented and Functional
**Last Updated**: Current Implementation
**Version**: 1.0.0
