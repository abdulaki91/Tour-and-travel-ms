# Search and Notification Badge Fixes

## Summary

Fixed two key issues:

1. **Search functionality** - Added URL parameter support to PackagesPage
2. **Notification badge count** - Enhanced initial notification loading in SocketContext

## Changes Made

### 1. Search Functionality Enhancement

#### File: `frontend/src/pages/PackagesPage.tsx`

**Changes:**

- Added `useSearchParams` hook to read URL query parameters
- Updated initial filters state to include search from URL
- Added `useEffect` to update filters when URL search parameter changes

**How it works:**

1. User types in search bar in Navbar and presses Enter
2. Navbar navigates to `/packages?search=query`
3. PackagesPage reads the `search` parameter from URL
4. Filters are automatically updated with the search term
5. Packages are fetched with the search filter applied

**Example:**

```typescript
// Before
const [filters, setFilters] = useState<PackageFilters>({
  page: 1,
  limit: 12,
  sort_by: "created_at",
  sort_order: "desc",
});

// After
const [searchParams] = useSearchParams();
const urlSearch = searchParams.get("search");

const [filters, setFilters] = useState<PackageFilters>({
  page: 1,
  limit: 12,
  sort_by: "created_at",
  sort_order: "desc",
  search: urlSearch || undefined,
});

// Update when URL changes
useEffect(() => {
  if (urlSearch) {
    setFilters((prev) => ({
      ...prev,
      search: urlSearch,
      page: 1,
    }));
  }
}, [urlSearch]);
```

### 2. Notification Badge Count Fix

#### File: `frontend/src/context/SocketContext.tsx`

**Problem:**

- Notification badge was not displaying count on initial page load
- `unreadCount` was initialized to 0 and only updated via socket events
- Socket connection might be delayed or the `unread_count_updated` event might not fire immediately

**Solution:**

- Added `fetchInitialNotifications()` function to fetch notifications via REST API on socket connection
- Calculates unread count from fetched notifications
- Provides immediate feedback even before socket events arrive

**Changes:**

```typescript
const fetchInitialNotifications = useCallback(async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/notifications?limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      setNotifications(data.notifications || []);

      // Calculate unread count from fetched notifications
      const unread = (data.notifications || []).filter(
        (n: Notification) => !n.is_read,
      ).length;
      setUnreadCount(unread);
      console.log(
        "📊 Initial notifications loaded:",
        data.notifications?.length,
        "Unread:",
        unread,
      );
    }
  } catch (error) {
    console.error("Failed to fetch initial notifications:", error);
  }
}, [token]);

// Call on socket connection
newSocket.on("connect", () => {
  console.log("🔌 Socket connected successfully");
  setIsConnected(true);

  // Get initial unread count and notifications
  newSocket.emit("get_unread_count");

  // Fetch initial notifications to populate the list
  fetchInitialNotifications();
});
```

## Testing

### Search Functionality

1. Navigate to the home page
2. Click the search icon in the navbar (desktop) or use the search bar (mobile)
3. Type a search term (e.g., "coffee", "highland", "tour")
4. Press Enter or submit the form
5. Verify you're redirected to `/packages?search=<your-term>`
6. Verify the packages page shows filtered results
7. Verify the search input on the packages page shows your search term

### Notification Badge

1. Log in as a user
2. Check the notification bell icon in the navbar
3. Verify the red badge shows the correct unread count
4. Open the notification dropdown
5. Mark a notification as read
6. Verify the badge count decreases
7. Mark all as read
8. Verify the badge disappears (count = 0)

## Debug Console Logs

The following console logs help debug issues:

**NotificationBell.tsx:**

```
NotificationBell - unreadCount: X isConnected: true/false
```

**SocketContext.tsx:**

```
🔌 Initializing socket connection...
🔌 Socket connected successfully
📊 Initial notifications loaded: X Unread: Y
📊 Unread count updated: X
```

## Files Modified

1. `frontend/src/pages/PackagesPage.tsx` - Added URL search parameter support
2. `frontend/src/context/SocketContext.tsx` - Added initial notification fetching
3. `frontend/src/components/Navbar.tsx` - Already had search functionality (no changes)
4. `frontend/src/components/DashboardNavbar.tsx` - Already had search functionality (no changes)
5. `frontend/src/components/notifications/NotificationBell.tsx` - Already had badge display (no changes)

## Next Steps

If issues persist:

1. **Search not working:**
   - Check browser console for errors
   - Verify the API endpoint `/api/packages` accepts `search` parameter
   - Check network tab to see the actual API request

2. **Badge not showing:**
   - Check browser console for the debug logs
   - Verify socket connection is established (green dot on bell icon)
   - Check if notifications exist in the database
   - Verify the `/api/notifications` endpoint returns data
   - Check if the user has unread notifications

3. **Badge count incorrect:**
   - Compare the count from REST API vs Socket event
   - Check if `is_read` field is correctly set in database
   - Verify the socket event `unread_count_updated` is being emitted by backend
