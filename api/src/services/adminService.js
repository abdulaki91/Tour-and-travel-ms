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
        u.name,
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

  static async deleteCompany(companyId) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Check if company has any active bookings
      const [bookings] = await connection.execute(
        `SELECT COUNT(*) as count 
         FROM bookings b 
         JOIN packages p ON b.package_id = p.id 
         WHERE p.company_id = ? AND b.status IN ('pending', 'confirmed')`,
        [companyId],
      );

      if (bookings[0].count > 0) {
        throw new Error("Cannot delete company with active bookings");
      }

      // Delete company (cascade will handle related records)
      const [result] = await connection.execute(
        "DELETE FROM companies WHERE id = ?",
        [companyId],
      );

      if (result.affectedRows === 0) {
        throw new Error("Company not found");
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
      })),
    };
  }

  static async getAllUsers(filters = {}) {
    const { page = 1, limit = 10, search = '', role = '', status = '' } = filters;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      whereClause += ' AND r.name = ?';
      params.push(role);
    }

    if (status !== '') {
      whereClause += ' AND u.is_active = ?';
      params.push(status === 'active');
    }

    const [users] = await pool.execute(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
        r.name as role_name,
        c.company_name, c.is_verified as company_verified
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN companies c ON u.id = c.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN companies c ON u.id = c.user_id
      ${whereClause}`,
      params
    );

    return {
      items: users,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  static async updateUserStatus(userId, isActive) {
    const [result] = await pool.execute(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [isActive, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }

    return { success: true, message: 'User status updated successfully' };
  }

  static async deleteUser(userId) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Check if user exists and get role
      const [users] = await connection.execute(
        'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];

      // If company user, delete company data first
      if (user.role_name === 'COMPANY') {
        // Delete company packages (this will cascade to bookings)
        await connection.execute('DELETE FROM packages WHERE company_id = ?', [userId]);
        
        // Delete company record
        await connection.execute('DELETE FROM companies WHERE user_id = ?', [userId]);
      }

      // Delete user's bookings and related data
      await connection.execute('DELETE FROM reviews WHERE user_id = ?', [userId]);
      await connection.execute('DELETE FROM notifications WHERE user_id = ?', [userId]);
      
      // Delete payments for user's bookings
      await connection.execute(
        'DELETE p FROM payments p JOIN bookings b ON p.booking_id = b.id WHERE b.user_id = ?',
        [userId]
      );
      
      // Delete user's bookings
      await connection.execute('DELETE FROM bookings WHERE user_id = ?', [userId]);

      // Finally delete the user
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

      await connection.commit();
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAllCompanies(filters = {}) {
    const { page = 1, limit = 10, search = '', status = '' } = filters;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (c.company_name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status !== '') {
      whereClause += ' AND c.is_verified = ?';
      params.push(status === 'verified');
    }

    const [companies] = await pool.execute(
      `SELECT 
        c.*, u.name as owner_name, u.email, u.phone, u.is_active,
        COUNT(p.id) as total_packages,
        COUNT(CASE WHEN p.is_active = true THEN 1 END) as active_packages
      FROM companies c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN packages p ON c.user_id = p.company_id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total
      FROM companies c
      JOIN users u ON c.user_id = u.id
      ${whereClause}`,
      params
    );

    return {
      items: companies,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  static async verifyCompany(companyId, isVerified) {
    const [result] = await pool.execute(
      'UPDATE companies SET is_verified = ? WHERE id = ?',
      [isVerified, companyId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Company not found');
    }

    return { success: true, message: 'Company verification status updated successfully' };
  }

  static async deleteCompany(companyId) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get company user ID
      const [companies] = await connection.execute(
        'SELECT user_id FROM companies WHERE id = ?',
        [companyId]
      );

      if (companies.length === 0) {
        throw new Error('Company not found');
      }

      const userId = companies[0].user_id;

      // Delete company packages and related data
      await connection.execute('DELETE FROM packages WHERE company_id = ?', [userId]);
      
      // Delete company record
      await connection.execute('DELETE FROM companies WHERE id = ?', [companyId]);

      // Delete the user account
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

      await connection.commit();
      return { success: true, message: 'Company deleted successfully' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAllReviews(filters = {}) {
    const { page = 1, limit = 10, search = '', rating = '' } = filters;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (p.title LIKE ? OR u.name LIKE ? OR r.comment LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (rating) {
      whereClause += ' AND r.rating = ?';
      params.push(parseInt(rating));
    }

    const [reviews] = await pool.execute(
      `SELECT 
        r.*, u.name as user_name, p.title as package_title,
        c.company_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN packages p ON r.package_id = p.id
      JOIN companies c ON p.company_id = c.user_id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN packages p ON r.package_id = p.id
      JOIN companies c ON p.company_id = c.user_id
      ${whereClause}`,
      params
    );

    return {
      items: reviews,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  static async deleteReview(reviewId) {
    const [result] = await pool.execute(
      'DELETE FROM reviews WHERE id = ?',
      [reviewId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Review not found');
    }

    return { success: true, message: 'Review deleted successfully' };
  }

  static async getSystemHealth() {
    try {
      // Test database connection
      const [dbTest] = await pool.execute('SELECT 1 as test');
      
      // Get system stats
      const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
      const [companyCount] = await pool.execute('SELECT COUNT(*) as count FROM companies');
      const [packageCount] = await pool.execute('SELECT COUNT(*) as count FROM packages');
      const [bookingCount] = await pool.execute('SELECT COUNT(*) as count FROM bookings');

      return {
        database: {
          status: 'healthy',
          connection: 'active',
          last_check: new Date().toISOString()
        },
        system: {
          uptime: process.uptime(),
          memory_usage: process.memoryUsage(),
          node_version: process.version,
          environment: process.env.NODE_ENV || 'development'
        },
        statistics: {
          total_users: userCount[0].count,
          total_companies: companyCount[0].count,
          total_packages: packageCount[0].count,
          total_bookings: bookingCount[0].count
        }
      };
    } catch (error) {
      return {
        database: {
          status: 'unhealthy',
          connection: 'failed',
          error: error.message,
          last_check: new Date().toISOString()
        },
        system: {
          uptime: process.uptime(),
          memory_usage: process.memoryUsage(),
          node_version: process.version,
          environment: process.env.NODE_ENV || 'development'
        }
      };
    }
  }

  static async generateReport(type, filters = {}) {
    const { startDate, endDate } = filters;
    
    switch (type) {
      case 'revenue':
        return await this.generateRevenueReport(startDate, endDate);
      case 'bookings':
        return await this.generateBookingsReport(startDate, endDate);
      case 'users':
        return await this.generateUsersReport(startDate, endDate);
      case 'companies':
        return await this.generateCompaniesReport(startDate, endDate);
      default:
        throw new Error('Invalid report type');
    }
  }

  static async generateRevenueReport(startDate, endDate) {
    const dateFilter = startDate && endDate 
      ? 'AND p.payment_date BETWEEN ? AND ?' 
      : '';
    const params = startDate && endDate ? [startDate, endDate] : [];

    const [revenue] = await pool.execute(
      `SELECT 
        DATE(p.payment_date) as date,
        COUNT(p.id) as transaction_count,
        SUM(p.amount) as total_revenue,
        AVG(p.amount) as avg_transaction
      FROM payments p
      WHERE p.status = 'completed' ${dateFilter}
      GROUP BY DATE(p.payment_date)
      ORDER BY date DESC`,
      params
    );

    const [summary] = await pool.execute(
      `SELECT 
        COUNT(p.id) as total_transactions,
        SUM(p.amount) as total_revenue,
        AVG(p.amount) as avg_transaction,
        MIN(p.amount) as min_transaction,
        MAX(p.amount) as max_transaction
      FROM payments p
      WHERE p.status = 'completed' ${dateFilter}`,
      params
    );

    return {
      type: 'revenue',
      period: { startDate, endDate },
      summary: summary[0],
      data: revenue.map(item => ({
        ...item,
        total_revenue: parseFloat(item.total_revenue),
        avg_transaction: parseFloat(item.avg_transaction)
      }))
    };
  }

  static async generateBookingsReport(startDate, endDate) {
    const dateFilter = startDate && endDate 
      ? 'AND b.created_at BETWEEN ? AND ?' 
      : '';
    const params = startDate && endDate ? [startDate, endDate] : [];

    const [bookings] = await pool.execute(
      `SELECT 
        DATE(b.created_at) as date,
        COUNT(b.id) as booking_count,
        SUM(b.total_amount) as total_value,
        COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_count,
        COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_count
      FROM bookings b
      WHERE 1=1 ${dateFilter}
      GROUP BY DATE(b.created_at)
      ORDER BY date DESC`,
      params
    );

    const [statusDistribution] = await pool.execute(
      `SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as total_value
      FROM bookings b
      WHERE 1=1 ${dateFilter}
      GROUP BY status`,
      params
    );

    return {
      type: 'bookings',
      period: { startDate, endDate },
      data: bookings.map(item => ({
        ...item,
        total_value: parseFloat(item.total_value || 0)
      })),
      status_distribution: statusDistribution.map(item => ({
        ...item,
        total_value: parseFloat(item.total_value || 0)
      }))
    };
  }

  static async generateUsersReport(startDate, endDate) {
    const dateFilter = startDate && endDate 
      ? 'AND u.created_at BETWEEN ? AND ?' 
      : '';
    const params = startDate && endDate ? [startDate, endDate] : [];

    const [users] = await pool.execute(
      `SELECT 
        DATE(u.created_at) as date,
        COUNT(u.id) as new_users,
        COUNT(CASE WHEN r.name = 'USER' THEN 1 END) as regular_users,
        COUNT(CASE WHEN r.name = 'COMPANY' THEN 1 END) as company_users
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE 1=1 ${dateFilter}
      GROUP BY DATE(u.created_at)
      ORDER BY date DESC`,
      params
    );

    const [roleDistribution] = await pool.execute(
      `SELECT 
        r.name as role,
        COUNT(u.id) as count
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE 1=1 ${dateFilter}
      GROUP BY r.name`,
      params
    );

    return {
      type: 'users',
      period: { startDate, endDate },
      data: users,
      role_distribution: roleDistribution
    };
  }

  static async generateCompaniesReport(startDate, endDate) {
    const dateFilter = startDate && endDate 
      ? 'AND c.created_at BETWEEN ? AND ?' 
      : '';
    const params = startDate && endDate ? [startDate, endDate] : [];

    const [companies] = await pool.execute(
      `SELECT 
        c.*,
        u.name as owner_name,
        u.email,
        COUNT(p.id) as total_packages,
        COUNT(CASE WHEN p.is_active = true THEN 1 END) as active_packages,
        COALESCE(SUM(b.total_amount), 0) as total_revenue
      FROM companies c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN packages p ON c.user_id = p.company_id
      LEFT JOIN bookings b ON p.id = b.package_id
      WHERE 1=1 ${dateFilter}
      GROUP BY c.id
      ORDER BY total_revenue DESC`,
      params
    );

    return {
      type: 'companies',
      period: { startDate, endDate },
      data: companies.map(item => ({
        ...item,
        total_revenue: parseFloat(item.total_revenue || 0)
      }))
    };
  }
}