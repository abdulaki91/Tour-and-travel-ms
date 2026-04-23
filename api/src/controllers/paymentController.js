import { PaymentService } from "../services/paymentService.js";
import { BookingService } from "../services/bookingService.js";

export class PaymentController {
  static async createPayment(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      // Verify booking belongs to user
      const booking = await BookingService.getBookingById(bookingId);
      if (!booking || booking.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to create payment for this booking",
        });
      }

      const payment = await PaymentService.createPayment(bookingId, req.body);

      res.status(201).json({
        success: true,
        message: "Payment initiated successfully",
        data: payment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async processPayment(req, res) {
    try {
      const { id } = req.params;
      const { success = true } = req.body; // Mock parameter

      // Get payment details first
      const payment = await PaymentService.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      // Verify user owns this payment
      if (payment.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to process this payment",
        });
      }

      const processedPayment = await PaymentService.mockPaymentProcess(
        id,
        success,
      );

      res.status(200).json({
        success: true,
        message: `Payment ${processedPayment.status} successfully`,
        data: processedPayment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async verifyPayment(req, res) {
    try {
      const { id } = req.params;

      // Get payment details first
      const payment = await PaymentService.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      // Verify user owns this payment
      if (payment.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to verify this payment",
        });
      }

      const verifiedPayment = await PaymentService.verifyPayment(id);

      res.status(200).json({
        success: true,
        message: "Payment verification completed",
        data: verifiedPayment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async processRefund(req, res) {
    try {
      const { id } = req.params;
      const refundData = req.body;

      const refund = await PaymentService.processRefund(id, refundData);

      res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        data: refund,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      // Verify user owns this payment
      if (payment.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to view this payment",
        });
      }

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getMyPayments(req, res) {
    try {
      const userId = req.user.id;
      const result = await PaymentService.getUserPayments(userId, req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getBookingPayments(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      // Verify booking belongs to user
      const booking = await BookingService.getBookingById(bookingId);
      if (!booking || booking.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to view payments for this booking",
        });
      }

      const payments = await PaymentService.getBookingPayments(bookingId);

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Webhook handlers
  static async handleTelebirrWebhook(req, res) {
    try {
      const signature = req.headers["x-telebirr-signature"];
      const payload = req.body;

      await PaymentService.handleWebhook("telebirr", payload, signature);

      res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
      });
    } catch (error) {
      console.error("Telebirr webhook error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async handleChapaWebhook(req, res) {
    try {
      const signature = req.headers["x-chapa-signature"];
      const payload = req.body;

      await PaymentService.handleWebhook("chapa", payload, signature);

      res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
      });
    } catch (error) {
      console.error("Chapa webhook error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
