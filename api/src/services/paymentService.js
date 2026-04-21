import pool from "../config/database.js";
import { generateTransactionReference } from "../utils/jwt.js";

export class PaymentService {
  static async createPayment(bookingId, paymentData) {
    const { amount, payment_method } = paymentData;
    const transaction_reference = generateTransactionReference();

    // Verify booking exists
    const [bookings] = await pool.execute(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId],
    );

    if (bookings.length === 0) {
      throw new Error("Booking not found");
    }

    const booking = bookings[0];

    // Verify amount matches booking total
    if (parseFloat(amount) !== parseFloat(booking.total_amount)) {
      throw new Error("Payment amount does not match booking total");
    }

    // Create payment record
    const [result] = await pool.execute(
      `INSERT INTO payments (booking_id, amount, payment_method, transaction_reference, status) 
       VALUES (?, ?, ?, ?, 'pending')`,
      [bookingId, amount, payment_method, transaction_reference],
    );

    return await this.getPaymentById(result.insertId);
  }

  static async getPaymentById(id) {
    const [payments] = await pool.execute(
      `SELECT 
        p.*,
        b.booking_reference,
        b.user_id,
        pkg.title as package_title,
        u.first_name,
        u.last_name,
        u.email
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN packages pkg ON b.package_id = pkg.id
      JOIN users u ON b.user_id = u.id
      WHERE p.id = ?`,
      [id],
    );

    return payments.length > 0 ? payments[0] : null;
  }

  static async processPayment(paymentId, status = "completed") {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Update payment status
      const [paymentResult] = await connection.execute(
        "UPDATE payments SET status = ?, payment_date = CURRENT_TIMESTAMP WHERE id = ?",
        [status, paymentId],
      );

      if (paymentResult.affectedRows === 0) {
        throw new Error("Payment not found");
      }

      // Get payment details
      const [payments] = await connection.execute(
        "SELECT booking_id FROM payments WHERE id = ?",
        [paymentId],
      );

      const bookingId = payments[0].booking_id;

      // Update booking status based on payment status
      if (status === "completed") {
        await connection.execute(
          'UPDATE bookings SET status = "confirmed" WHERE id = ?',
          [bookingId],
        );
      } else if (status === "failed") {
        await connection.execute(
          'UPDATE bookings SET status = "cancelled" WHERE id = ?',
          [bookingId],
        );

        // Restore package slots
        const [bookings] = await connection.execute(
          "SELECT package_id, number_of_people FROM bookings WHERE id = ?",
          [bookingId],
        );

        if (bookings.length > 0) {
          await connection.execute(
            "UPDATE packages SET available_slots = available_slots + ? WHERE id = ?",
            [bookings[0].number_of_people, bookings[0].package_id],
          );
        }
      }

      await connection.commit();
      return await this.getPaymentById(paymentId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getBookingPayments(bookingId) {
    const [payments] = await pool.execute(
      "SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC",
      [bookingId],
    );

    return payments;
  }

  static async getUserPayments(userId, filters = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      sort_by = "created_at",
      sort_order = "desc",
    } = filters;
    const offset = (page - 1) * limit;

    let whereConditions = ["b.user_id = ?"];
    let queryParams = [userId];

    if (status) {
      whereConditions.push("p.status = ?");
      queryParams.push(status);
    }

    const whereClause = whereConditions.join(" AND ");

    const [payments] = await pool.execute(
      `SELECT 
        p.*,
        b.booking_reference,
        pkg.title as package_title,
        pkg.location as package_location
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN packages pkg ON b.package_id = pkg.id
      WHERE ${whereClause}
      ORDER BY p.${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM payments p 
       JOIN bookings b ON p.booking_id = b.id 
       WHERE ${whereClause}`,
      queryParams,
    );

    const total = countResult[0].total;

    return {
      payments,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    };
  }

  static async mockPaymentProcess(paymentId, shouldSucceed = true) {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const status = shouldSucceed ? "completed" : "failed";
    return await this.processPayment(paymentId, status);
  }
}
