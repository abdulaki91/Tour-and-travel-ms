import jsPDF from "jspdf";
import QRCode from "qrcode";

export interface ReceiptData {
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  package_title: string;
  package_location: string;
  booking_date: string;
  number_of_people: number;
  total_amount: number;
  payment_method: string;
  payment_date: string;
  company_name: string;
  transaction_reference?: string;
}

export class ReceiptService {
  static async generateReceipt(receiptData: ReceiptData): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Modern color palette
    const primaryColor = [37, 99, 235]; // Blue
    const accentColor = [139, 92, 246]; // Purple
    const successColor = [16, 185, 129]; // Green
    const darkGray = [31, 41, 55];
    const lightGray = [243, 244, 246];
    const textGray = [107, 114, 128];

    try {
      // ===== HEADER WITH GRADIENT EFFECT =====
      // Top gradient bar
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, pageWidth, 50, "F");

      // Accent stripe
      pdf.setFillColor(139, 92, 246);
      pdf.rect(0, 50, pageWidth, 3, "F");

      // Company name and logo area
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.text("East Hararghe Tours", 20, 25);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text("Your Gateway to Ethiopian Adventures", 20, 35);

      // Receipt title with modern styling
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(15, 60, pageWidth - 30, 35, 3, 3, "F");

      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("PAYMENT RECEIPT", 20, 75);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(107, 114, 128);
      pdf.text(
        `Issued: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        20,
        88,
      );

      // Status badge
      pdf.setFillColor(16, 185, 129);
      pdf.roundedRect(pageWidth - 65, 68, 45, 15, 2, 2, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("PAID", pageWidth - 55, 78);

      // ===== BOOKING REFERENCE HIGHLIGHT =====
      let yPos = 110;
      pdf.setFillColor(243, 244, 246);
      pdf.roundedRect(15, yPos - 8, pageWidth - 30, 20, 2, 2, "F");

      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("BOOKING REFERENCE:", 20, yPos + 3);

      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(receiptData.booking_reference, 80, yPos + 3);

      // ===== CUSTOMER INFORMATION CARD =====
      yPos = 145;
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(15, yPos - 10, (pageWidth - 35) / 2, 70, 3, 3, "S");

      // Section header with colored circle
      pdf.setFillColor(37, 99, 235);
      pdf.circle(23, yPos - 3, 3, "F");

      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("Customer Details", 30, yPos);

      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      yPos += 12;
      pdf.setFont("helvetica", "bold");
      pdf.text("Name:", 20, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(receiptData.customer_name, 45, yPos);

      yPos += 10;
      pdf.setFont("helvetica", "bold");
      pdf.text("Email:", 20, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(receiptData.customer_email, 45, yPos);

      if (receiptData.customer_phone) {
        yPos += 10;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("Phone:", 20, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(receiptData.customer_phone, 45, yPos);
      }

      // ===== QR CODE CARD =====
      const qrX = (pageWidth + 35) / 2;
      yPos = 145;
      pdf.setDrawColor(229, 231, 235);
      pdf.roundedRect(qrX, yPos - 10, (pageWidth - 35) / 2, 70, 3, 3, "S");

      pdf.setFillColor(139, 92, 246);
      pdf.circle(qrX + 8, yPos - 3, 3, "F");

      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("Verification", qrX + 15, yPos);

      // Generate QR Code
      const qrData = JSON.stringify({
        ref: receiptData.booking_reference,
        customer: receiptData.customer_name,
        amount: receiptData.total_amount,
        date: receiptData.payment_date,
        package: receiptData.package_title,
        verified: true,
        timestamp: new Date().toISOString(),
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: "#1F2937",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      });

      // Add QR code with border
      const qrSize = 50;
      const qrPosX = qrX + ((pageWidth - 35) / 2 - qrSize) / 2;
      pdf.addImage(qrCodeDataURL, "PNG", qrPosX, yPos + 5, qrSize, qrSize);

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(107, 114, 128);
      const qrTextX = qrX + (pageWidth - 35) / 2 / 2;
      pdf.text("Scan to verify", qrTextX, yPos + 62, { align: "center" });

      // ===== BOOKING DETAILS SECTION =====
      yPos = 230;
      pdf.setFillColor(37, 99, 235);
      pdf.circle(23, yPos - 3, 3, "F");

      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("Package Information", 30, yPos);

      yPos += 10;
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(15, yPos - 5, pageWidth - 30, 55, 3, 3, "S");

      yPos += 5;
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(receiptData.package_title, 20, yPos);

      yPos += 12;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      // Package details in two columns
      const col1X = 20;
      const col2X = pageWidth / 2 + 10;

      pdf.setFont("helvetica", "bold");
      pdf.text("Location:", col1X, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(receiptData.package_location, col1X + 25, yPos);

      pdf.setFont("helvetica", "bold");
      pdf.text("Travelers:", col2X, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${receiptData.number_of_people} people`, col2X + 25, yPos);

      yPos += 10;
      pdf.setFont("helvetica", "bold");
      pdf.text("Travel Date:", col1X, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        new Date(receiptData.booking_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        col1X + 30,
        yPos,
      );

      // ===== PAYMENT DETAILS SECTION =====
      yPos += 25;
      pdf.setFillColor(139, 92, 246);
      pdf.circle(23, yPos - 3, 3, "F");

      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("Payment Information", 30, yPos);

      yPos += 10;
      pdf.setDrawColor(229, 231, 235);
      pdf.roundedRect(15, yPos - 5, pageWidth - 30, 40, 3, 3, "S");

      yPos += 5;
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      pdf.setFont("helvetica", "bold");
      pdf.text("Method:", col1X, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        receiptData.payment_method.replace("_", " ").toUpperCase(),
        col1X + 25,
        yPos,
      );

      pdf.setFont("helvetica", "bold");
      pdf.text("Date:", col2X, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        new Date(receiptData.payment_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        col2X + 20,
        yPos,
      );

      if (receiptData.transaction_reference) {
        yPos += 10;
        pdf.setFont("helvetica", "bold");
        pdf.text("Transaction ID:", col1X, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text(receiptData.transaction_reference, col1X + 35, yPos);
      }

      // ===== TOTAL AMOUNT - HIGHLIGHTED =====
      yPos += 20;
      pdf.setFillColor(16, 185, 129);
      pdf.roundedRect(15, yPos - 8, pageWidth - 30, 25, 3, 3, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("TOTAL AMOUNT PAID", 20, yPos + 3);

      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      const amountText = `${receiptData.total_amount.toLocaleString()} ETB`;
      pdf.text(amountText, pageWidth - 20, yPos + 5, { align: "right" });

      // ===== FOOTER =====
      const footerY = pageHeight - 35;

      // Footer background
      pdf.setFillColor(249, 250, 251);
      pdf.rect(0, footerY - 5, pageWidth, 40, "F");

      // Divider line
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.5);
      pdf.line(20, footerY, pageWidth - 20, footerY);

      // Footer text
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Thank you for choosing East Hararghe Tours!",
        pageWidth / 2,
        footerY + 10,
        {
          align: "center",
        },
      );

      pdf.setFontSize(8);
      pdf.text(
        "Email: support@easthararghetours.com  |  Phone: +251-91-123-4567",
        pageWidth / 2,
        footerY + 18,
        { align: "center" },
      );

      pdf.text(
        "Website: www.easthararghetours.com",
        pageWidth / 2,
        footerY + 24,
        { align: "center" },
      );

      pdf.setFontSize(7);
      pdf.setTextColor(156, 163, 175);
      pdf.text(
        "This is a computer-generated receipt and does not require a signature.",
        pageWidth / 2,
        footerY + 32,
        { align: "center" },
      );

      // ===== WATERMARK =====
      pdf.setTextColor(248, 250, 252);
      pdf.setFontSize(60);
      pdf.setFont("helvetica", "bold");
      pdf.text("PAID", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      });

      // Save the PDF
      const fileName = `Receipt_${receiptData.booking_reference}_${Date.now()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating receipt:", error);
      throw new Error("Failed to generate receipt");
    }
  }

  static async generateAndDownloadReceipt(
    receiptData: ReceiptData,
  ): Promise<void> {
    try {
      await this.generateReceipt(receiptData);
    } catch (error) {
      console.error("Receipt generation failed:", error);
      throw error;
    }
  }
}
