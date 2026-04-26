# Receipt Design Preview

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ████████████████████████████████████████████████████████   │ ← Blue Gradient Header
│  🌍 East Hararghe Tours                                     │
│  Your Gateway to Ethiopian Adventures                       │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ ← Purple Accent Stripe
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PAYMENT RECEIPT                        ✓ PAID        │  │ ← White Card
│  │  Issued: December 20, 2024                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  BOOKING REFERENCE:  BK-2024-001234                   │  │ ← Highlighted Box
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │ 👤 Customer Details     │  │ 🔒 Verification         │  │
│  │                         │  │                         │  │
│  │ Name: John Doe          │  │   ┌─────────────┐      │  │
│  │ Email: john@email.com   │  │   │   ███████   │      │  │
│  │ Phone: +251-91-XXX-XXXX │  │   │   ███████   │      │  │ ← QR Code
│  │                         │  │   │   ███████   │      │  │
│  └─────────────────────────┘  │   └─────────────┘      │  │
│                                │   Scan to verify       │  │
│                                └─────────────────────────┘  │
│                                                               │
│  ● 📦 Package Information                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Harar Cultural Heritage Tour                         │  │
│  │                                                        │  │
│  │  📍 Location: Harar        👥 Travelers: 2 people     │  │
│  │  📅 Travel Date: January 15, 2025                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ● 💳 Payment Information                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Method: BANK TRANSFER     Date: Dec 20, 2024        │  │
│  │  Transaction ID: TXN-2024-ABC123                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  TOTAL AMOUNT PAID              15,000 ETB           │  │ ← Green Highlight
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│                         P A I D                              │ ← Watermark (45°)
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Footer Background
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│       Thank you for choosing East Hararghe Tours!            │
│  📧 support@easthararghetours.com  |  📞 +251-91-123-4567   │
│              🌐 www.easthararghetours.com                    │
│                                                               │
│  This is a computer-generated receipt and does not require   │
│  a signature.                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Primary Colors:

- **Blue (#2563EB)**: Header, primary text, accents
- **Purple (#8B5CF6)**: Accent stripe, verification section
- **Green (#10B981)**: Success indicators, total amount, PAID badge

### Secondary Colors:

- **Dark Gray (#1F2937)**: Body text
- **Light Gray (#F3F4F6)**: Backgrounds, subtle elements
- **Text Gray (#6B7280)**: Secondary text, labels

## Typography Hierarchy

```
Company Name:        28pt Bold (White)
Tagline:            11pt Normal (White)
Receipt Title:      24pt Bold (Blue)
Section Headers:    13pt Bold (Blue/Purple)
Package Title:      12pt Bold (Dark Gray)
Body Text:          10pt Normal (Dark Gray)
Labels:             10pt Bold (Dark Gray)
Total Amount:       20pt Bold (White on Green)
Footer Text:        9pt Normal (Gray)
Legal Text:         7pt Normal (Light Gray)
```

## Key Features

### 1. Header Section

- Gradient blue background
- Company branding with emoji
- Professional tagline
- Purple accent stripe

### 2. Status Indicators

- Green "✓ PAID" badge (top right)
- Large "PAID" watermark (center, 45° angle)
- Visual confirmation of payment

### 3. Information Cards

- Rounded corners (3px radius)
- Light borders
- Organized sections
- Icon indicators

### 4. QR Code

- 50x50mm size
- High error correction (Level H)
- Verification data encoded
- Scannable from mobile devices

### 5. Two-Column Layout

- Efficient space usage
- Easy to scan information
- Balanced design
- Professional appearance

## Notification Badge Design

### Before:

```
┌────────┐
│   🔔   │  ← Bell icon
│  ●     │  ← Red/green dot (connection)
│    (5) │  ← Animated badge (count)
└────────┘
```

### After:

```
┌────────┐
│  (5)   │  ← Red badge with count (primary)
│   🔔   │  ← Bell icon
│      ● │  ← Small dot (connection, secondary)
└────────┘
```

### Badge Specifications:

- **Size**: 20px min-width × 20px height
- **Color**: Red (#EF4444) background, White text
- **Border**: 2px white border
- **Shadow**: Subtle shadow for depth
- **Font**: Bold, 12px
- **Position**: Top-right of bell icon

### Connection Indicator:

- **Size**: 8px diameter
- **Colors**: Green (connected), Gray (disconnected)
- **Border**: 1px white border
- **Position**: Bottom-right of bell icon
- **Tooltip**: Shows connection status on hover

## Print Optimization

### Page Setup:

- **Format**: A4 (210mm × 297mm)
- **Orientation**: Portrait
- **Margins**: 15mm all sides
- **Resolution**: 300 DPI equivalent

### Print-Friendly Features:

- High contrast colors
- Clear typography
- Adequate spacing
- No background images
- Scannable QR code
- Professional layout

## Mobile Responsiveness

### QR Code Scanning:

- Optimized for mobile camera scanning
- High contrast for better recognition
- Error correction for damaged codes
- Clear instructions

### Button Layout:

- Touch-friendly size (44px minimum)
- Adequate spacing
- Clear labels
- Loading states

## Accessibility Features

### Visual:

- High contrast ratios (WCAG AA compliant)
- Clear typography hierarchy
- Adequate font sizes
- Color-blind friendly palette

### Structural:

- Logical information flow
- Clear section headers
- Consistent spacing
- Professional alignment

## File Output

### Naming Convention:

```
Receipt_[BOOKING_REFERENCE]_[TIMESTAMP].pdf

Example:
Receipt_BK-2024-001234_1703088000000.pdf
```

### File Properties:

- **Format**: PDF
- **Size**: ~50-100 KB
- **Pages**: 1 page
- **Compression**: Optimized
- **Fonts**: Embedded (Helvetica)

## Usage Examples

### Customer Use Cases:

1. **Proof of Payment**: Show to tour operator
2. **Expense Reporting**: Submit to employer
3. **Record Keeping**: Personal financial records
4. **Verification**: Scan QR code to verify authenticity
5. **Reference**: Keep booking details handy

### Company Use Cases:

1. **Payment Confirmation**: Verify customer payment
2. **Record Keeping**: Financial documentation
3. **Customer Service**: Reference for support
4. **Audit Trail**: Compliance and reporting
5. **Dispute Resolution**: Proof of transaction

---

**Design Status**: ✅ Production Ready
**Last Updated**: Current Implementation
**Version**: 2.0.0 (Modern Design)
