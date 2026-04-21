import pool from "../config/database.js";
import { generateBookingReference } from "../utils/jwt.js";

export class BookingService {
  static async createBooking(userId, bookingData) {
    const { package_id, number_of_people, booking_date, special_requests } =
      bookingData;

    // Get package details
    const [packages] = await pool.execute(
      "SELECT * FROM packages WHERE id = ? AND is_active = true",
      [package_id],
    );

    if (packages.length === 0) {
      throw new Error("Package not found or inactive");
    }

    const packageInfo = packages[0];

    // Check availability
    if (packageInfo.available_slots < number_of_people) {
      throw new Error("Not enough available slots for this booking");
    }

    // Check if booking date is within package date range
    const bookingDateObj = new Date(booking_date);
    const startDate = new Date(packageInfo.start_date);
    const endDate = new Date(packageInfo.end_date);

    if (bookingDateObj < startDate || bookingDateObj > endDate) {
      throw new Error("Booking date is outside package availability period");
    }

    // Calculate total amount
    const total_amount = packageInfo.price * number_of_people;
    const booking_reference = generateBookingReference();

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Create booking
      const [bookingResult] = await connection.execute(
        `INSERT INTO bookings (
          user_id, package_id, booking_reference, number_of_people, 
          total_amount, booking_date, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          package_id,
          booking_reference,
          number_of_people,
          total_amount,
          booking_date,
          special_requests,
        ],
      );

      // Update package available slots
      await connection.execute(
        "UPDATE packages SET available_slots = available_slots - ? WHERE id = ?",
        [number_of_people, package_id],
      );

      await connection.commit();

      return await this.getBookingById(bookingResult.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getBookingById(id) {
    const [bookings] = await pool.execute(
      `SELECT 
        b.*,
        p.title as package_title,
        p.location as package_location,
        p.duration_days,
        p.start_date as package_start_date,
        p.end_date as package_end_date,
        c.company_name,
        u.first_name,
        u.last_name,
        u.email as user_email,
        u.phone as user_phone
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN companies c ON p.company_id = c.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ?`,
      [id],
    );

    return bookings.length > 0 ? bookings[0] : null;
  }

  static async getUserBookings(userId, filters = {}) {
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
      whereConditions.push("b.status = ?");
      queryParams.push(status);
    }

    const whereClause = whereConditions.join(" AND ");

    const [bookings] = await pool.execute(
      `SELECT 
        b.*,
        p.title as package_title,
        p.location as package_location,
        p.duration_days,
        p.images as package_images,
        c.company_name
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN companies c ON p.company_id = c.id
      WHERE ${whereClause}
      ORDER BY b.${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM bookings b WHERE ${whereClause}`,
      queryParams,
    );

    const total = countResult[0].total;

    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      package_images: booking.package_images
        ? JSON.parse(booking.package_images)
        : [],
    }));

    return {
      bookings: formattedBookings,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    };
  }

  static async getCompanyBookings(companyId, filters = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      sort_by = "created_at",
      sort_order = "desc",
    } = filters;
    const offset = (page - 1) * limit;

    let whereConditions = ["p.company_id = ?"];
    let queryParams = [companyId];

    if (status) {
      whereConditions.push("b.status = ?");
      queryParams.push(status);
    }

    const whereClause = whereConditions.join(" AND ");

    const [bookings] = await pool.execute(
      `SELECT 
        b.*,
        p.title as package_title,
        p.location as package_location,
        u.first_name,
        u.last_name,
        u.email as user_email,
        u.phone as user_phone
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE ${whereClause}
      ORDER BY b.${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM bookings b 
       JOIN packages p ON b.package_id = p.id 
       WHERE ${whereClause}`,
      queryParams,
    );

    const total = countResult[0].total;

    return {
      bookings,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    };
  }

  static async updateBookingStatus(
    id,
    status,
    userId = null,
    companyId = null,
  ) {
    let query =
      "UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    let params = [status, id];

    if (userId) {
      query += " AND user_id = ?";
      params.push(userId);
    } else if (companyId) {
      query = `UPDATE bookings b 
               JOIN packages p ON b.package_id = p.id 
               SET b.status = ?, b.updated_at = CURRENT_TIMESTAMP 
               WHERE b.id = ? AND p.company_id = ?`;
      params = [status, id, companyId];
    }

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      throw new Error("Booking not found or unauthorized");
    }

    // If cancelling, restore available slots
    if (status === "cancelled") {
      const booking = await this.getBookingById(id);
      if (booking) {
        await pool.execute(
          "UPDATE packages SET available_slots = available_slots + ? WHERE id = ?",
          [booking.number_of_people, booking.package_id],
        );
      }
    }

    return await this.getBookingById(id);
  }

  static async cancelBooking(id, userId) {
    // Check if booking can be cancelled (not already completed or cancelled)
    const [bookings] = await pool.execute(
      "SELECT status FROM bookings WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (bookings.length === 0) {
      throw new Error("Booking not found");
    }

    const booking = bookings[0];
    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new Error(`Cannot cancel booking with status: ${booking.status}`);
    }

    return await this.updateBookingStatus(id, "cancelled", userId);
  }
}
