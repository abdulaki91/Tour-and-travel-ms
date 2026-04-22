import pool from "../config/database.js";

export class AdminService {
  static async getDashboardStats() {
    // Get total users
    const [userStats] = await pool.execute(
      "SELECT COUNT(*) as total_users FROM users WHERE is_active = true",
    );

    // Get total companies
    const [companyStats] = await pool.execute(
      "SELECT COUNT(*) as total_companies FROM companies",
    );

    // Get pending companies
    const [pendingCompanies] = await pool.execute(
      "SELECT COUNT(*) as pending_companies FROM companies WHERE is_verified = false",
    );

    // Get total packages
    const [packageStats] = await pool.execute(
      "SELECT COUNT(*) as total_packages FROM packages",
    );

    // Get active packages
    const [activePackages] = await pool.execute(
      "SELECT COUNT(*) as active_packages FROM packages WHERE is_active = true",
    );

    // Get total bookings
    const [bookingStats] = await pool.execute(
      "SELECT COUNT(*) as total_bookings FROM bookings",
    );

    // Get total revenue
    const [revenueStats] = await pool.execute(
      `SELECT COALESCE(SUM(p.amount), 0) as total_revenue 
       FROM payments p 
       WHERE p.status = 'completed'`,
    );

    // Get monthly revenue for the last 12 months
    const [monthlyRevenue] = await pool.execute(
      `SELECT 
        DATE_FORMAT(p.payment_date, '%Y-%m') as month,
        SUM(p.amount) as revenue
      FROM payments p
      WHERE p.status = 'completed' 
        AND p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(p.payment_date, '%Y-%m')
      ORDER BY month ASC`,
    );

    // Get booking status distribution
    const [bookingStatusStats] = await pool.execute(
      `SELECT 
        status,
        COUNT(*) as count
      FROM bookings
      GROUP BY status`,
    );

    // Get top packages by bookings
    const [topPackages] = await pool.execute(
      `SELECT 
        p.id,
        p.title,
        p.location,
        COUNT(b.id) as booking_count,
        SUM(b.total_amount) as total_revenue
      FROM packages p
      LEFT JOIN bookings b ON p.id = b.package_id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY booking_count DESC
      LIMIT 10`,
    );

    return {
      overview: {
        total_users: userStats[0].total_users,
        total_companies: companyStats[0].total_companies,
        pending_companies: pendingCompanies[0].pending_companies,
        total_packages: packageStats[0].total_packages,
        active_packages: activePackages[0].active_packages,
        total_bookings: bookingStats[0].total_bookings,
        total_revenue: parseFloat(revenueStats[0].total_revenue),
      },
      monthly_revenue: monthlyRevenue.map((item) => ({
        month: item.month,
        revenue: parseFloat(item.revenue),
      })),
      booking_status_distribution: bookingStatusStats.map((item) => ({
        status: item.status,
        count: parseInt(item.count),
      })),
      top_packages: topPackages.map((item) => ({
        ...item,
        booking_count: parseInt(item.booking_count),
        total_revenue: parseFloat(item.total_revenue || 0),
      })),
    };
  }

  static async getAllUsers(filters = {}) {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sort_by = "created_at",
      sort_order = "desc",
    } = filters;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (role) {
      whereConditions.push("r.name = ?");
      queryParams.push(role);
    }

    if (search) {
      whereConditions.push("(u.name LIKE ? OR u.email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const [users] = await pool.execute(
      `SELECT 
        u.id,
        u.email,
        u.name,
        u.phone,
        u.profile_image,
        u.is_active,
        u.email_verified,
        u.created_at,
        r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ${whereClause}
      ORDER BY u.${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       ${whereClause}`,
      queryParams,
    );

    const total = countResult[0].total;

    return {
      users,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    };
  }

  static async getAllCompanies(filters = {}) {
    const {
      page = 1,
      limit = 10,
      verified,
      search,
      sort_by = "created_at",
      sort_order = "desc",
    } = filters;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (verified !== undefined) {
      whereConditions.push("c.is_verified = ?");
      queryParams.push(verified);
    }

    if (search) {
      whereConditions.push("(c.company_name LIKE ? OR c.email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const [companies] = await pool.execute(
      `SELECT 
        c.*,
        u.first_name,
        u.last_name,
        u.email as user_email,
        COUNT(p.id) as package_count
      FROM companies c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN packages p ON c.id = p.company_id AND p.is_active = true
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM companies c 
       JOIN users u ON c.user_id = u.id 
       ${whereClause}`,
      queryParams,
    );

    const total = countResult[0].total;

    const formattedCompanies = companies.map((company) => ({
      ...company,
      package_count: parseInt(company.package_count),
    }));

    return {
      companies: formattedCompanies,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    };
  }

  static async updateUserStatus(userId, isActive) {
    const [result] = await pool.execute(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [isActive, userId],
    );

    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }

    return true;
  }

  static async verifyCompany(companyId, isVerified) {
    const [result] = await pool.execute(
      "UPDATE companies SET is_verified = ? WHERE id = ?",
      [isVerified, companyId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Company not found");
    }

    return true;
  }

  static async deleteUser(userId) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Check if user has any bookings
      const [bookings] = await connection.execute(
        "SELECT COUNT(*) as count FROM bookings WHERE user_id = ?",
        [userId],
      );

      if (bookings[0].count > 0) {
        throw new Error("Cannot delete user with existing bookings");
      }

      // Delete user (cascade will handle related records)
      const [result] = await connection.execute(
        "DELETE FROM users WHERE id = ?",
        [userId],
      );

      if (result.affectedRows === 0) {
        throw new Error("User not found");
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
