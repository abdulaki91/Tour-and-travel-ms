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
}
