import axios from "axios";
import crypto from "crypto";

export class PaymentGatewayService {
  // Telebirr Payment Integration
  static async initiateTelebirrPayment(paymentData) {
    const { amount, booking_reference, user_phone, return_url } = paymentData;

    try {
      // Mock Telebirr API integration
      // In production, replace with actual Telebirr API endpoints
      const telebirrPayload = {
        amount: amount,
        currency: "ETB",
        reference: booking_reference,
        phone: user_phone,
        return_url: return_url,
        callback_url: `${process.env.API_BASE_URL}/api/payments/telebirr/callback`,
        merchant_id: process.env.TELEBIRR_MERCHANT_ID,
        timestamp: Date.now(),
      };

      // Generate signature for security
      const signature = this.generateTelebirrSignature(telebirrPayload);
      telebirrPayload.signature = signature;

      // For now, return mock response
      // const response = await axios.post(process.env.TELEBIRR_API_URL, telebirrPayload);

      // Mock successful response
      return {
        success: true,
        payment_url: `https://mock-telebirr.com/pay?ref=${booking_reference}`,
        transaction_id: `TB_${Date.now()}`,
        status: "pending",
      };
    } catch (error) {
      console.error("Telebirr payment initiation failed:", error);
      throw new Error("Failed to initiate Telebirr payment");
    }
  }

  // Chapa Payment Integration
  static async initiateChapaPayment(paymentData) {
    const { amount, booking_reference, user_email, user_phone, return_url } =
      paymentData;

    try {
      // Mock Chapa API integration
      const chapaPayload = {
        amount: amount,
        currency: "ETB",
        email: user_email,
        phone_number: user_phone,
        tx_ref: booking_reference,
        callback_url: `${process.env.API_BASE_URL}/api/payments/chapa/callback`,
        return_url: return_url,
        customization: {
          title: "East Hararghe Tour & Travel",
          description: "Tour package booking payment",
        },
      };

      const headers = {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      };

      // For now, return mock response
      // const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', chapaPayload, { headers });

      // Mock successful response
      return {
        success: true,
        payment_url: `https://mock-chapa.com/pay?ref=${booking_reference}`,
        transaction_id: `CH_${Date.now()}`,
        status: "pending",
      };
    } catch (error) {
      console.error("Chapa payment initiation failed:", error);
      throw new Error("Failed to initiate Chapa payment");
    }
  }

  // Bank Transfer Instructions
  static generateBankTransferInstructions(paymentData) {
    const { amount, booking_reference } = paymentData;

    return {
      success: true,
      instructions: {
        bank_name: "Commercial Bank of Ethiopia",
        account_number: "1000123456789",
        account_name: "East Hararghe Tour & Travel",
        amount: amount,
        reference: booking_reference,
        swift_code: "CBETETAA",
        branch: "Harar Branch",
        note: `Please include booking reference ${booking_reference} in the transfer description`,
      },
      status: "pending_bank_transfer",
    };
  }

  // Verify Telebirr Payment
  static async verifyTelebirrPayment(transactionId) {
    try {
      // Mock verification
      // In production, call Telebirr verification API

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      return {
        success: isSuccess,
        status: isSuccess ? "completed" : "failed",
        transaction_id: transactionId,
        amount: 1000, // This would come from the API response
        verified_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Telebirr verification failed:", error);
      return {
        success: false,
        status: "failed",
        error: error.message,
      };
    }
  }

  // Verify Chapa Payment
  static async verifyChapaPayment(transactionId) {
    try {
      // Mock verification
      // In production, call Chapa verification API

      const headers = {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      };

      // const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${transactionId}`, { headers });

      // Mock successful response (100% success rate for demo)
      const isSuccess = true;

      return {
        success: isSuccess,
        status: "completed",
        transaction_id: transactionId,
        amount: null, // processPayment will fall back to stored payment amount
        verified_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Chapa verification failed:", error);
      return {
        success: false,
        status: "failed",
        error: error.message,
      };
    }
  }

  // Process Refund
  static async processRefund(paymentData) {
    const { transaction_id, amount, reason, payment_method } = paymentData;

    try {
      let refundResult;

      switch (payment_method) {
        case "telebirr":
          refundResult = await this.processTelebirrRefund(
            transaction_id,
            amount,
            reason,
          );
          break;
        case "chapa":
          refundResult = await this.processChapaRefund(
            transaction_id,
            amount,
            reason,
          );
          break;
        case "bank_transfer":
          refundResult = await this.processBankRefund(
            transaction_id,
            amount,
            reason,
          );
          break;
        default:
          throw new Error("Unsupported payment method for refund");
      }

      return refundResult;
    } catch (error) {
      console.error("Refund processing failed:", error);
      throw new Error("Failed to process refund");
    }
  }

  static async processTelebirrRefund(transactionId, amount, reason) {
    // Mock Telebirr refund
    return {
      success: true,
      refund_id: `TB_REF_${Date.now()}`,
      status: "refund_pending",
      amount: amount,
      estimated_completion: "3-5 business days",
    };
  }

  static async processChapaRefund(transactionId, amount, reason) {
    // Mock Chapa refund
    return {
      success: true,
      refund_id: `CH_REF_${Date.now()}`,
      status: "refund_pending",
      amount: amount,
      estimated_completion: "1-3 business days",
    };
  }

  static async processBankRefund(transactionId, amount, reason) {
    // Mock bank refund
    return {
      success: true,
      refund_id: `BK_REF_${Date.now()}`,
      status: "refund_pending",
      amount: amount,
      estimated_completion: "5-7 business days",
      note: "Refund will be processed to the original bank account",
    };
  }

  // Generate signature for Telebirr
  static generateTelebirrSignature(payload) {
    const secretKey = process.env.TELEBIRR_SECRET_KEY || "mock_secret_key";
    const sortedKeys = Object.keys(payload).sort();
    const signatureString = sortedKeys
      .map((key) => `${key}=${payload[key]}`)
      .join("&");

    return crypto
      .createHmac("sha256", secretKey)
      .update(signatureString)
      .digest("hex");
  }

  // Webhook signature verification
  static verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );
  }

  // Get payment method fees
  static getPaymentFees(method, amount) {
    const fees = {
      telebirr: {
        fixed: 5, // 5 ETB fixed fee
        percentage: 0.015, // 1.5%
        min: 5,
        max: 100,
      },
      chapa: {
        fixed: 0,
        percentage: 0.025, // 2.5%
        min: 2,
        max: 200,
      },
      bank_transfer: {
        fixed: 10, // 10 ETB bank fee
        percentage: 0,
        min: 10,
        max: 10,
      },
    };

    const feeConfig = fees[method];
    if (!feeConfig) return 0;

    const percentageFee = amount * feeConfig.percentage;
    const totalFee = feeConfig.fixed + percentageFee;

    return Math.min(Math.max(totalFee, feeConfig.min), feeConfig.max);
  }

  // Currency conversion (if needed)
  static async convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;

    // Mock conversion rates
    const rates = {
      USD_ETB: 55.0,
      EUR_ETB: 60.0,
      ETB_USD: 0.018,
      ETB_EUR: 0.017,
    };

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const rate = rates[rateKey];

    if (!rate) {
      throw new Error(
        `Conversion rate not available for ${fromCurrency} to ${toCurrency}`,
      );
    }

    return Math.round(amount * rate * 100) / 100;
  }
}
