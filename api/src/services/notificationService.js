import pool from "../config/database.js";
import { emitNotificationToUser } from "../socket/index.js";

export class NotificationService {
  static async createNotification(userId, notificationData) {
    const { title, message, type } = notificationData;

    const [result] = await pool.execute(
      "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
      [userId, title, message, type],
    );

    const newNotification = await this.getNotificationById(result.insertId);

    // Emit real-time notification with enhanced functionality
    if (newNotification) {
      emitNotificationToUser(userId, newNotification);
    }

    return newNotification;
  }

  static async getNotificationById(id) {
    const [notifications] = await pool.execute(
      "SELECT * FROM notifications WHERE id = ?",
      [id],
    );

    return notifications.length > 0 ? notifications[0] : null;
  }

  static async getUserNotifications(userId, filters = {}) {
    const {
      page = 1,
      limit = 10,
      is_read,
      type,
      sort_by = "created_at",
      sort_order = "desc",
    } = filters;
    const offset = (page - 1) * limit;

    let whereConditions = ["user_id = ?"];
    let queryParams = [userId];

    if (is_read !== undefined) {
      whereConditions.push("is_read = ?");
      queryParams.push(is_read);
    }

    if (type) {
      whereConditions.push("type = ?");
      queryParams.push(type);
    }

    const whereClause = whereConditions.join(" AND ");

    const [notifications] = await pool.execute(
      `SELECT * FROM notifications 
       WHERE ${whereClause}
       ORDER BY ${sort_by} ${sort_order.toUpperCase()}
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM notifications WHERE ${whereClause}`,
      queryParams,
    );

    const total = countResult[0].total;

    return {
      notifications,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    };
  }

  static async markAsRead(notificationId, userId) {
    const [result] = await pool.execute(
      "UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?",
      [notificationId, userId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Notification not found or unauthorized");
    }

    return await this.getNotificationById(notificationId);
  }

  static async markAllAsRead(userId) {
    const [result] = await pool.execute(
      "UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false",
      [userId],
    );

    return result.affectedRows;
  }

  static async deleteNotification(notificationId, userId) {
    const [result] = await pool.execute(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [notificationId, userId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Notification not found or unauthorized");
    }

    return true;
  }

  static async getUnreadCount(userId) {
    const [result] = await pool.execute(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false",
      [userId],
    );

    return result[0].count;
  }

  // Helper methods for creating specific notification types
  static async notifyBookingConfirmed(userId, bookingData) {
    return await this.createNotification(userId, {
      title: "Booking Confirmed",
      message: `Your booking for "${bookingData.package_title}" has been confirmed. Booking reference: ${bookingData.booking_reference}`,
      type: "booking_confirmed",
    });
  }

  static async notifyPaymentCompleted(userId, paymentData) {
    return await this.createNotification(userId, {
      title: "Payment Successful",
      message: `Your payment of $${paymentData.amount} has been processed successfully. Transaction reference: ${paymentData.transaction_reference}`,
      type: "payment_completed",
    });
  }

  static async notifyPaymentFailed(userId, paymentData) {
    return await this.createNotification(userId, {
      title: "Payment Failed",
      message: `Your payment of $${paymentData.amount} could not be processed. Please try again or contact support.`,
      type: "payment_failed",
    });
  }

  static async notifyBookingCancelled(userId, bookingData) {
    return await this.createNotification(userId, {
      title: "Booking Cancelled",
      message: `Your booking for "${bookingData.package_title}" has been cancelled. Booking reference: ${bookingData.booking_reference}`,
      type: "booking_cancelled",
    });
  }

  static async notifyNewBooking(companyUserId, bookingData) {
    return await this.createNotification(companyUserId, {
      title: "New Booking Received",
      message: `You have received a new booking for "${bookingData.package_title}" from ${bookingData.first_name} ${bookingData.last_name}`,
      type: "new_booking",
    });
  }
}
