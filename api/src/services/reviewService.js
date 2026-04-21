import pool from "../config/database.js";

export class ReviewService {
  static async createReview(userId, reviewData) {
    const { package_id, booking_id, rating, comment } = reviewData;

    // Check if booking exists and belongs to user
    const [bookings] = await pool.execute(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = "completed"',
      [booking_id, userId],
    );

    if (bookings.length === 0) {
      throw new Error("Booking not found or not completed");
    }

    // Check if review already exists
    const [existingReviews] = await pool.execute(
      "SELECT id FROM reviews WHERE user_id = ? AND booking_id = ?",
      [userId, booking_id],
    );

    if (existingReviews.length > 0) {
      throw new Error("Review already exists for this booking");
    }

    // Create review
    const [result] = await pool.execute(
      `INSERT INTO reviews (user_id, package_id, booking_id, rating, comment) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, package_id, booking_id, rating, comment],
    );

    return await this.getReviewById(result.insertId);
  }

  static async getReviewById(id) {
    const [reviews] = await pool.execute(
      `SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.profile_image,
        p.title as package_title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN packages p ON r.package_id = p.id
      WHERE r.id = ?`,
      [id],
    );

    return reviews.length > 0 ? reviews[0] : null;
  }

  static async getPackageReviews(packageId, filters = {}) {
    const {
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_order = "desc",
    } = filters;
    const offset = (page - 1) * limit;

    const [reviews] = await pool.execute(
      `SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.profile_image
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.package_id = ?
      ORDER BY r.${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?`,
      [packageId, limit, offset],
    );

    // Get total count
    const [countResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM reviews WHERE package_id = ?",
      [packageId],
    );

    const total = countResult[0].total;

    return {
      reviews,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    };
  }

  static async updateReview(id, userId, updateData) {
    const { rating, comment } = updateData;

    const [result] = await pool.execute(
      "UPDATE reviews SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
      [rating, comment, id, userId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Review not found or unauthorized");
    }

    return await this.getReviewById(id);
  }

  static async deleteReview(id, userId) {
    const [result] = await pool.execute(
      "DELETE FROM reviews WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Review not found or unauthorized");
    }

    return true;
  }

  static async getUserReviews(userId, filters = {}) {
    const {
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_order = "desc",
    } = filters;
    const offset = (page - 1) * limit;

    const [reviews] = await pool.execute(
      `SELECT 
        r.*,
        p.title as package_title,
        p.location as package_location
      FROM reviews r
      JOIN packages p ON r.package_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );

    // Get total count
    const [countResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM reviews WHERE user_id = ?",
      [userId],
    );

    const total = countResult[0].total;

    return {
      reviews,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    };
  }
}
