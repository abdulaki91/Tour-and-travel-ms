import jsPDF from "jspdf";
import QRCode from "qrcode";

export interface ReceiptData {
  booking: {
    id: number;
    booking_reference: string;
    package_title: string;
    package_location: string;
    duration_days: number;
    booking_date: string;
    number_of_people: number;
    total_amount: number;
    status: string;
    created_at: string;
    company_name: string;
    special_requests?: string;
  };
  payment: {
    id: number;
    amount: number;
    fees?: number;
    total_amount: number;
    payment_method: string;
    transaction_reference: string;
    status: string;
    payment_date?: string;
    created_at: string;
  };
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export const receiptService = {
  async generateReceipt(data: ReceiptData): Promise<void> {
    const { booking, payment, user } = data;

    // Create PDF document
    const doc = new jsPDF();

    // Set up colors
    const primaryColor = [59, 130, 246]; // Blue
    const grayColor = [107, 114, 128];
    const darkColor = [17, 24, 39];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, "F");

    // Company Logo/Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("East Hararghe Tour & Travel", 20, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Official Booking Receipt", 20, 32);

    // Receipt title
    doc.setTextColor(...darkColor);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("BOOKING RECEIPT", 20, 55);

    // Receipt info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 20, 65);
    doc.text(`Booking Reference: ${booking.booking_reference}`, 20, 72);

    // Customer Information
    let yPos = 85;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkColor);
    doc.text("Customer Information", 20, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text(`Name: ${user.name}`, 20, yPos);
    yPos += 7;
    doc.text(`Email: ${user.email}`, 20, yPos);
    if (user.phone) {
      yPos += 7;
      doc.text(`Phone: ${user.phone}`, 20, yPos);
    }

    // Booking Details
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkColor);
    doc.text("Booking Details", 20, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text(`Package: ${booking.package_title}`, 20, yPos);
    yPos += 7;
    doc.text(`Destination: ${booking.package_location}`, 20, yPos);
    yPos += 7;
    doc.text(`Duration: ${booking.duration_days} days`, 20, yPos);
    yPos += 7;
    doc.text(
      `Travel Date: ${new Date(booking.booking_date).toLocaleDateString()}`,
      20,
      yPos,
    );
    yPos += 7;
    doc.text(`Number of Travelers: ${booking.number_of_people}`, 20, yPos);
    yPos += 7;
    doc.text(`Tour Operator: ${booking.company_name}`, 20, yPos);
    yPos += 7;
    doc.text(`Booking Status: ${booking.status.toUpperCase()}`, 20, yPos);

    if (booking.special_requests) {
      yPos += 7;
      doc.text(`Special Requests: ${booking.special_requests}`, 20, yPos);
    }

    // Payment Details
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkColor);
    doc.text("Payment Details", 20, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text(
      `Payment Method: ${this.getPaymentMethodName(payment.payment_method)}`,
      20,
      yPos,
    );
    yPos += 7;
    doc.text(`Transaction ID: ${payment.transaction_reference}`, 20, yPos);
    yPos += 7;
    doc.text(`Payment Status: ${payment.status.toUpperCase()}`, 20, yPos);
    yPos += 7;
    doc.text(
      `Payment Date: ${payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "Pending"}`,
      20,
      yPos,
    );

    // Payment breakdown
    yPos += 15;
    doc.setDrawColor(...grayColor);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.text(
      `Package Amount: ${this.formatAmount(payment.amount)} ETB`,
      20,
      yPos,
    );
    if (payment.fees) {
      yPos += 7;
      doc.text(
        `Processing Fees: ${this.formatAmount(payment.fees)} ETB`,
        20,
        yPos,
      );
    }

    yPos += 10;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkColor);
    doc.text(
      `Total Amount: ${this.formatAmount(payment.total_amount)} ETB`,
      20,
      yPos,
    );

    // Generate QR Code
    const qrData = {
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      paymentId: payment.id,
      transactionReference: payment.transaction_reference,
      amount: payment.total_amount,
      status: payment.status,
      verificationUrl: `${window.location.origin}/verify/${booking.booking_reference}`,
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 100,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Add QR Code
    doc.addImage(qrCodeDataURL, "PNG", 140, 85, 50, 50);

    // QR Code label
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text("Scan for verification", 150, 145);

    // Footer
    yPos = 250;
    doc.setDrawColor(...grayColor);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      "This is an official receipt from East Hararghe Tour & Travel",
      20,
      yPos,
    );
    yPos += 5;
    doc.text(
      "For support, contact: support@easthararghetour.com | +251 91 123 4567",
      20,
      yPos,
    );
    yPos += 5;
    doc.text(
      "Present this receipt and QR code upon arrival for verification",
      20,
      yPos,
    );

    // Save the PDF
    doc.save(`receipt-${booking.booking_reference}.pdf`);
  },

  getPaymentMethodName(method: string): string {
    const methods: Record<string, string> = {
      telebirr: "Telebirr",
      chapa: "Chapa",
      bank_transfer: "Bank Transfer",
      credit_card: "Credit Card",
      debit_card: "Debit Card",
    };
    return methods[method] || method;
  },

  formatAmount(amount: number): string {
    return amount.toLocaleString();
  },
};
