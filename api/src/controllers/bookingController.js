import { BookingService } from "../services/bookingService.js";
import pool from "../config/database.js";

export class BookingController {
  static async createBooking(req, res) {
    try {
      const userId = req.user.id;
      const booking = await BookingService.createBooking(userId, req.body);

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getMyBookings(req, res) {
    try {
      const userId = req.user.id;
      const result = await BookingService.getUserBookings(userId, req.query);

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

  static async getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await BookingService.getBookingById(id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Check if user owns this booking or is the company owner
      const userId = req.user.id;
      const userRole = req.user.role_name;

      if (userRole === "USER" && booking.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to view this booking",
        });
      }

      if (userRole === "COMPANY") {
        const [companies] = await pool.execute(
          "SELECT id FROM companies WHERE user_id = ?",
          [userId],
        );

        if (companies.length === 0) {
          return res.status(403).json({
            success: false,
            message: "Company not found",
          });
        }

        const [packages] = await pool.execute(
          "SELECT company_id FROM packages WHERE id = ?",
          [booking.package_id],
        );

        if (
          packages.length === 0 ||
          packages[0].company_id !== companies[0].id
        ) {
          return res.status(403).json({
            success: false,
            message: "Unauthorized to view this booking",
          });
        }
      }

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const booking = await BookingService.cancelBooking(id, userId);

      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: booking,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getCompanyBookings(req, res) {
    try {
      // Get company ID for the authenticated user
      const [companies] = await pool.execute(
        "SELECT id FROM companies WHERE user_id = ?",
        [req.user.id],
      );

      if (companies.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Company not found",
        });
      }

      const companyId = companies[0].id;
      const result = await BookingService.getCompanyBookings(
        companyId,
        req.query,
      );

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

  static async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Get company ID for the authenticated user
      const [companies] = await pool.execute(
        "SELECT id FROM companies WHERE user_id = ?",
        [req.user.id],
      );

      if (companies.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Company not found",
        });
      }

      const companyId = companies[0].id;
      const booking = await BookingService.updateBookingStatus(
        id,
        status,
        null,
        companyId,
      );

      res.status(200).json({
        success: true,
        message: "Booking status updated successfully",
        data: booking,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
