import { AdminService } from "../services/adminService.js";

export class AdminController {
  static async getDashboard(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const result = await AdminService.getAllUsers(req.query);

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

  static async getAllCompanies(req, res) {
    try {
      const result = await AdminService.getAllCompanies(req.query);

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

  static async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { is_active } = req.body;

      await AdminService.updateUserStatus(userId, is_active);

      res.status(200).json({
        success: true,
        message: `User ${is_active ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async verifyCompany(req, res) {
    try {
      const { companyId } = req.params;
      const { is_verified } = req.body;

      await AdminService.verifyCompany(companyId, is_verified);

      res.status(200).json({
        success: true,
        message: `Company ${is_verified ? "verified" : "unverified"} successfully`,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteCompany(req, res) {
    try {
      const { companyId } = req.params;

      await AdminService.deleteCompany(companyId);

      res.status(200).json({
        success: true,
        message: "Company deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      await AdminService.deleteUser(userId);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAllReviews(req, res) {
    try {
      const result = await AdminService.getAllReviews(req.query);

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

  static async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;

      await AdminService.deleteReview(reviewId);

      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getSystemHealth(req, res) {
    try {
      const health = await AdminService.getSystemHealth();

      res.status(200).json({
        success: true,
        data: health,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async generateReport(req, res) {
    try {
      const { type } = req.params;
      const filters = req.query;

      const report = await AdminService.generateReport(type, filters);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async exportReport(req, res) {
    try {
      const { type } = req.params;
      const filters = req.query;

      const report = await AdminService.generateReport(type, filters);

      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${type}-report-${new Date().toISOString().split("T")[0]}.csv"`,
      );

      // Convert report data to CSV
      let csv = "";

      if (report.data && report.data.length > 0) {
        // Get headers from first object
        const headers = Object.keys(report.data[0]);
        csv += headers.join(",") + "\n";

        // Add data rows
        report.data.forEach((row) => {
          const values = headers.map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          });
          csv += values.join(",") + "\n";
        });
      }

      res.send(csv);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
