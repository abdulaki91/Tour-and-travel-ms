import pool from "../config/database.js";

export class CompanyController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      // Get company profile
      const [companies] = await pool.execute(
        "SELECT * FROM companies WHERE user_id = ?",
        [userId],
      );

      if (companies.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Company profile not found",
        });
      }

      res.status(200).json({
        success: true,
        data: companies[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const {
        company_name,
        description,
        address,
        phone,
        email,
        website,
        license_number,
      } = req.body;

      // Check if company exists
      const [companies] = await pool.execute(
        "SELECT id FROM companies WHERE user_id = ?",
        [userId],
      );

      if (companies.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Company profile not found",
        });
      }

      const companyId = companies[0].id;

      // Update company
      await pool.execute(
        `UPDATE companies 
         SET company_name = COALESCE(?, company_name),
             description = COALESCE(?, description),
             address = COALESCE(?, address),
             phone = COALESCE(?, phone),
             email = COALESCE(?, email),
             website = COALESCE(?, website),
             license_number = COALESCE(?, license_number),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          company_name,
          description,
          address,
          phone,
          email,
          website,
          license_number,
          companyId,
        ],
      );

      // Get updated company
      const [updatedCompanies] = await pool.execute(
        "SELECT * FROM companies WHERE id = ?",
        [companyId],
      );

      res.status(200).json({
        success: true,
        message: "Company profile updated successfully",
        data: updatedCompanies[0],
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
