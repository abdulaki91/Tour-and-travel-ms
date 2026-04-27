# Company Registration & Verification Workflow - Complete Guide

## 🎯 Overview

A complete, reliable company registration and verification system where:

1. **Users register** their companies themselves
2. **Admin reviews** and verifies/rejects companies
3. **Notifications** keep everyone informed
4. **Access control** ensures only verified companies can operate

---

## 📋 Complete Workflow

### **Step 1: User Registration**

```
User signs up → Creates account → Role: USER
```

### **Step 2: Company Registration**

```
User fills company form → Submits → Role changes to COMPANY → Status: Pending
```

### **Step 3: Admin Review**

```
Admin reviews company → Verifies OR Rejects with reason
```

### **Step 4: Notification**

```
User receives notification → If verified: Can create packages
                          → If rejected: Sees rejection reason
```

---

## 🔄 Detailed Process Flow

### **For Users:**

#### **1. Register Account**

- Go to signup page
- Fill in: Name, Email, Password
- Account created with USER role

#### **2. Register Company**

- Navigate to `/company/register`
- Fill in company details:
  - Company Name (required)
  - Business License
  - Address
  - Description
  - Website
  - Phone
  - Email
- Submit form
- **Automatic changes:**
  - User role: USER → COMPANY
  - Company status: Pending Verification
  - Redirect to dashboard

#### **3. Wait for Verification**

- Dashboard shows "Pending Verification" status
- Yellow banner with waiting message
- Limited access until verified
- Can view company details
- Cannot create packages yet

#### **4. Receive Notification**

- **If Approved:**
  - Green notification: "Company Verified Successfully"
  - Full access to create packages
  - Can receive bookings
- **If Rejected:**
  - Red notification: "Company Verification Rejected"
  - Shows rejection reason
  - Can update company details and resubmit

---

### **For Admins:**

#### **1. View Pending Companies**

- Go to Admin → Companies
- Filter by "Pending" status
- See list of unverified companies

#### **2. Review Company**

- Click "View Details" (eye icon)
- Review all company information:
  - Company name
  - Business license
  - Address
  - Description
  - Website
  - Owner details

#### **3. Verify or Reject**

- Click verification button (shield/clock icon)
- Choose action:

  **Option A: Verify**
  - Click "Verify Company"
  - Confirm action
  - Company status → Verified
  - Owner receives success notification

  **Option B: Reject**
  - Click "Reject Company"
  - Enter rejection reason (required)
  - Submit
  - Company status → Pending (unchanged)
  - Owner receives rejection notification with reason

---

## 🎨 UI Components

### **Company Registration Page** (`/company/register`)

#### **If No Company:**

Shows registration form with:

- Company information fields
- Info banner about verification process
- Submit button

#### **If Company Exists (Pending):**

Shows status card with:

- Company name
- Yellow "Pending Verification" badge
- Warning message about waiting
- Company details
- "Go to Dashboard" button

#### **If Company Exists (Verified):**

Shows status card with:

- Company name
- Green "Verified Company" badge
- Company details
- "Go to Dashboard" button

---

### **Admin Verification Modal**

#### **Step 1: Choose Action**

Two large buttons:

- **Verify Company** (Green)
  - Icon: CheckCircle
  - Description: "Approve this company..."
- **Reject Verification** (Red)
  - Icon: XCircle
  - Description: "Reject this company with a reason"

#### **Step 2A: Verify Confirmation**

- Green info box
- Explains what will happen
- "Verify Company" button

#### **Step 2B: Rejection Form**

- Textarea for rejection reason (required)
- Helper text: "The owner will receive this message"
- "Reject Company" button

---

## 🔧 API Endpoints

### **User Endpoints**

#### **1. Register Company**

```
POST /api/company/register
Authorization: Bearer <token>
```

**Request:**

```json
{
  "company_name": "Amazing Tours",
  "business_license": "BL123456",
  "address": "Addis Ababa, Ethiopia",
  "description": "Best tours in Ethiopia",
  "website": "https://amazingtours.com",
  "phone": "+251911123456",
  "email": "info@amazingtours.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Company registered successfully. Awaiting admin verification.",
  "data": {
    "id": 1,
    "user_id": 5,
    "company_name": "Amazing Tours",
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### **2. Get My Company**

```
GET /api/company/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 5,
    "company_name": "Amazing Tours",
    "license_number": "BL123456",
    "address": "Addis Ababa, Ethiopia",
    "description": "Best tours in Ethiopia",
    "website": "https://amazingtours.com",
    "phone": "+251911123456",
    "email": "info@amazingtours.com",
    "is_verified": false,
    "owner_name": "John Doe",
    "user_email": "john@example.com"
  }
}
```

---

#### **3. Update Company**

```
PUT /api/company/me
Authorization: Bearer <token>
```

**Request:**

```json
{
  "company_name": "Updated Tours",
  "description": "New description"
}
```

---

### **Admin Endpoints**

#### **1. Verify/Reject Company**

```
POST /api/admin/companies/:companyId/verify-with-reason
Authorization: Bearer <admin_token>
```

**Verify Request:**

```json
{
  "is_verified": true
}
```

**Reject Request:**

```json
{
  "is_verified": false,
  "rejection_reason": "Business license is invalid. Please provide a valid license number."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Company verified successfully",
  "data": {
    "id": 1,
    "company_name": "Amazing Tours",
    "is_verified": true
  }
}
```

---

## 🔒 Access Control

### **Unverified Companies:**

- ❌ Cannot create packages
- ❌ Cannot receive bookings
- ✅ Can view dashboard
- ✅ Can update company profile
- ✅ Can view notifications

### **Verified Companies:**

- ✅ Can create packages
- ✅ Can receive bookings
- ✅ Full dashboard access
- ✅ Can manage bookings
- ✅ Can view analytics

---

## 📧 Notifications

### **Verification Approved:**

```
Title: "Company Verified Successfully"
Message: "Congratulations! Your company 'Amazing Tours' has been verified.
         You can now create packages and receive bookings."
Type: success
```

### **Verification Rejected:**

```
Title: "Company Verification Rejected"
Message: "Your company 'Amazing Tours' verification was rejected.
         Reason: Business license is invalid. Please provide a valid license number."
Type: error
```

---

## 🎯 Use Cases

### **Use Case 1: New Company Registration**

**Scenario:** John wants to start offering tours

**Steps:**

1. John signs up → Account created (USER role)
2. John goes to `/company/register`
3. John fills company form:
   - Company Name: "John's Tours"
   - Business License: "BL789"
   - Description: "Personalized tours"
4. John submits form
5. **System automatically:**
   - Changes John's role to COMPANY
   - Creates company with is_verified = false
   - Shows pending status
6. John sees "Pending Verification" message
7. John waits for admin review

---

### **Use Case 2: Admin Approves Company**

**Scenario:** Admin reviews John's company

**Steps:**

1. Admin goes to Companies page
2. Admin filters by "Pending"
3. Admin sees "John's Tours"
4. Admin clicks verification button
5. Admin reviews details
6. Admin clicks "Verify Company"
7. **System automatically:**
   - Sets is_verified = true
   - Creates success notification for John
8. John receives notification
9. John can now create packages

---

### **Use Case 3: Admin Rejects Company**

**Scenario:** Company has invalid license

**Steps:**

1. Admin reviews company
2. Admin notices invalid license
3. Admin clicks "Reject Company"
4. Admin enters reason: "Business license is invalid"
5. Admin submits
6. **System automatically:**
   - Keeps is_verified = false
   - Creates error notification with reason
7. Owner receives notification with reason
8. Owner can update details and resubmit

---

## ✅ Features Checklist

### **Backend:**

- [x] Company registration endpoint
- [x] Get company endpoint
- [x] Update company endpoint
- [x] Verify/reject with reason endpoint
- [x] Automatic role change (USER → COMPANY)
- [x] Notification creation
- [x] Access control middleware
- [x] Validation

### **Frontend:**

- [x] Company registration page
- [x] Status display (Pending/Verified)
- [x] Admin verification modal
- [x] Verify/Reject actions
- [x] Rejection reason form
- [x] Loading states
- [x] Error handling
- [x] Success notifications

### **Database:**

- [x] Companies table
- [x] is_verified column
- [x] Notifications table
- [x] Foreign key constraints
- [x] Cascade deletes

---

## 🐛 Troubleshooting

### **"You already have a company registered"**

- User can only register one company
- Check if company already exists
- Update existing company instead

### **"Company with this name already exists"**

- Company names must be unique
- Try a different name
- Check if name is already taken

### **"Please provide a rejection reason"**

- Rejection reason is required
- Enter a clear explanation
- Helps company owner understand issue

### **Company still pending after verification**

- Check if verification was successful
- Refresh the page
- Check notifications

---

## 🎓 Best Practices

### **For Users:**

1. **Provide Complete Information**
   - Fill all fields accurately
   - Use valid business license
   - Provide working contact details

2. **Wait for Verification**
   - Don't create multiple companies
   - Check notifications regularly
   - Update details if rejected

3. **Professional Presentation**
   - Write clear description
   - Use professional email
   - Provide valid website

### **For Admins:**

1. **Thorough Review**
   - Check all company details
   - Verify business license
   - Validate contact information

2. **Clear Communication**
   - Provide specific rejection reasons
   - Be professional and helpful
   - Suggest what needs to be fixed

3. **Timely Response**
   - Review companies promptly
   - Don't leave companies waiting
   - Process in order received

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│           USER REGISTRATION             │
│  User signs up → Role: USER             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        COMPANY REGISTRATION             │
│  User fills form → Role: COMPANY        │
│  Company created → is_verified: false   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          ADMIN REVIEW                   │
│  Admin reviews → Verify OR Reject       │
└─────────────┬───────────┬───────────────┘
              │           │
      VERIFY  │           │  REJECT
              ▼           ▼
    ┌──────────────┐  ┌──────────────┐
    │ is_verified  │  │ is_verified  │
    │ = true       │  │ = false      │
    │              │  │              │
    │ Notification │  │ Notification │
    │ (Success)    │  │ (Error +     │
    │              │  │  Reason)     │
    └──────────────┘  └──────────────┘
```

---

## 🎉 Summary

The company registration and verification system is now:

- ✅ **Complete** - All features implemented
- ✅ **Reliable** - Proper error handling
- ✅ **Correct** - Follows best practices
- ✅ **User-Friendly** - Clear UI/UX
- ✅ **Admin-Friendly** - Easy verification process
- ✅ **Secure** - Proper access control
- ✅ **Notified** - Automatic notifications
- ✅ **Production-Ready** - Fully tested

**The system is ready for production use!** 🚀

---

## 📚 Related Documentation

- `ADMIN_COMPANY_ASSIGNMENT_GUIDE.md` - Admin company assignment
- `ADMIN_COMPANY_MANAGEMENT_COMPLETE.md` - Company management features
- `ADMIN_USER_MANAGEMENT_API.md` - User management API

---

**Status: PRODUCTION READY!** ✨
