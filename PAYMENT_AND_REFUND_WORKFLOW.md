# Payment and Refund Workflow Documentation

## Overview

This document clarifies the booking and payment workflow, including when refunds can be processed.

## Booking and Payment Status Flow

### 1. Initial Booking

- **Booking Status**: `pending`
- **Payment Status**: `pending`
- **Description**: Customer has made a booking but payment is not yet confirmed

### 2. Payment Confirmation

- **Action**: Company clicks "Confirm Payment & Booking"
- **Result**:
  - **Booking Status**: `pending` → `confirmed`
  - **Payment Status**: `pending` → `completed`
- **Description**: Payment is verified and booking is confirmed
- **Additional**: PDF receipt is automatically generated and downloaded

### 3. Trip Completion

- **Action**: Company marks booking as "Mark Complete"
- **Result**:
  - **Booking Status**: `confirmed` → `completed`
  - **Payment Status**: remains `completed`
- **Description**: Trip has been completed successfully

### 4. Cancellation/Refund

- **Action**: Company processes refund
- **Result**:
  - **Booking Status**: any status → `cancelled`
  - **Payment Status**: `completed` → `refunded`
- **Description**: Booking is cancelled and payment is refunded

## Refund Eligibility Rules

### ✅ **CAN BE REFUNDED**

- Payment Status: `completed`
- Booking Status: `pending`, `confirmed`, or `cancelled` (NOT `completed`)
- **Reason**: Payment was made but trip hasn't happened yet

### ❌ **CANNOT BE REFUNDED**

1. **Payment Status is NOT `completed`**
   - `pending`: No payment to refund
   - `failed`: Payment never went through
   - `refunded`: Already refunded

2. **Booking Status is `completed`**
   - Trip has already happened
   - Requires manual support intervention

## Refund Process

When a refund is processed:

1. Booking status changes to `cancelled`
2. Payment status changes to `refunded`
3. Package slots are restored (e.g., if 2 people booked, 2 slots are added back)
4. Customer receives refund notification
5. Refund is processed within 3-5 business days

## UI Button Logic

### Payment Management Section

- **"Confirm Payment & Booking"**: Shows when payment is `pending`
- **"Download Receipt"**: Shows when payment is `completed`
- **"Process Refund"**: Shows when payment is `completed` AND booking is NOT `completed`
- **"Send Payment Reminder"**: Shows when payment is NOT `completed` and NOT `refunded`

### Booking Actions Section

- **"Confirm"**: Shows when booking is `pending`
- **"Cancel"**: Shows when booking is `pending`
- **"Mark Complete"**: Shows when booking is `confirmed`
- **"Send Confirmation"**: Shows for various statuses to send updates

## Example Scenarios

### Scenario 1: Normal Flow

1. Customer books → Booking: `pending`, Payment: `pending`
2. Company confirms payment → Booking: `confirmed`, Payment: `completed`
3. Trip happens → Booking: `completed`, Payment: `completed`
4. **Refund**: Not possible (trip completed)

### Scenario 2: Cancellation Before Trip

1. Customer books → Booking: `pending`, Payment: `pending`
2. Company confirms payment → Booking: `confirmed`, Payment: `completed`
3. Customer wants to cancel → Company processes refund
4. Result → Booking: `cancelled`, Payment: `refunded`

### Scenario 3: Cancellation Before Payment

1. Customer books → Booking: `pending`, Payment: `pending`
2. Customer wants to cancel → Company cancels booking
3. Result → Booking: `cancelled`, Payment: `pending` (no refund needed)

## Key Points

- **Booking Status** tracks the trip lifecycle
- **Payment Status** tracks the money flow
- **Refunds** are only for confirmed payments where the trip hasn't happened
- **PDF Receipts** are generated when payment is confirmed
- **Slot Restoration** happens automatically during refunds
