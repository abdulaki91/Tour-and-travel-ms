import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tour_travel_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Remove invalid options that cause warnings
  multipleStatements: true, // Allow multiple statements
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    // First test connection without database
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;

    const tempPool = mysql.createPool(tempConfig);
    const connection = await tempPool.getConnection();
    console.log("✅ Database server connected successfully");
    connection.release();
    await tempPool.end();

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Initialize database schema
export const initializeDatabase = async () => {
  try {
    // First connect without specifying database to create it
    const tempConfig = { ...dbConfig };
    delete tempConfig.database; // Remove database from config temporarily

    const tempPool = mysql.createPool(tempConfig);
    const connection = await tempPool.getConnection();

    // Create database if not exists
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`,
    );

    connection.release();
    await tempPool.end(); // Close temporary pool

    // Now connect to the specific database
    const mainConnection = await pool.getConnection();
    await mainConnection.query(`USE ${dbConfig.database}`);

    // Create tables
    await createTables(mainConnection);

    mainConnection.release();
    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
};

const createTables = async (connection) => {
  // Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(200) NOT NULL,
      phone VARCHAR(20),
      profile_image VARCHAR(255),
      role_id INT NOT NULL DEFAULT 1,
      is_active BOOLEAN DEFAULT true,
      email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_role (role_id)
    )
  `);

  // Roles table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(50) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default roles
  await connection.query(`
    INSERT IGNORE INTO roles (id, name, description) VALUES 
    (1, 'USER', 'Regular user who can book packages'),
    (2, 'COMPANY', 'Travel company that can create packages'),
    (3, 'ADMIN', 'System administrator with full access')
  `);

  // Companies table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS companies (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT UNIQUE,
      company_name VARCHAR(255) NOT NULL,
      description TEXT,
      address TEXT,
      phone VARCHAR(20),
      email VARCHAR(255),
      website VARCHAR(255),
      license_number VARCHAR(100),
      logo VARCHAR(255),
      is_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_company_name (company_name),
      INDEX idx_verified (is_verified)
    )
  `);

  // Packages table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS packages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      company_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      location VARCHAR(255) NOT NULL,
      duration_days INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      max_people INT NOT NULL,
      available_slots INT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      includes TEXT,
      excludes TEXT,
      itinerary JSON,
      images JSON,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
      INDEX idx_location (location),
      INDEX idx_price (price),
      INDEX idx_dates (start_date, end_date),
      INDEX idx_active (is_active)
    )
  `);

  // Bookings table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      package_id INT NOT NULL,
      booking_reference VARCHAR(50) UNIQUE NOT NULL,
      number_of_people INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      booking_date DATE NOT NULL,
      status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
      special_requests TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
      INDEX idx_user (user_id),
      INDEX idx_package (package_id),
      INDEX idx_status (status),
      INDEX idx_booking_date (booking_date)
    )
  `);

  // Payments table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      booking_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      transaction_reference VARCHAR(255) UNIQUE NOT NULL,
      status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
      payment_date TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      INDEX idx_booking (booking_id),
      INDEX idx_status (status),
      INDEX idx_transaction (transaction_reference)
    )
  `);

  // Reviews table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      package_id INT NOT NULL,
      booking_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_booking (user_id, booking_id),
      INDEX idx_package (package_id),
      INDEX idx_rating (rating)
    )
  `);

  // Notifications table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user (user_id),
      INDEX idx_read (is_read),
      INDEX idx_type (type)
    )
  `);

  // System Settings table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT,
      setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
      description TEXT,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_setting_key (setting_key),
      INDEX idx_category (category)
    )
  `);

  // Insert default system settings
  const defaultSettings = [
    // General Settings
    [
      "site_name",
      "East Hararghe Tours",
      "string",
      "Name of the travel booking platform",
      "general",
    ],
    [
      "site_description",
      "Discover the beauty of East Hararghe with our curated travel packages",
      "string",
      "Brief description of the platform",
      "general",
    ],
    [
      "contact_email",
      "info@easthararghetours.com",
      "string",
      "Primary contact email",
      "general",
    ],
    [
      "contact_phone",
      "+251-911-123456",
      "string",
      "Primary contact phone number",
      "general",
    ],

    // System Settings
    [
      "maintenance_mode",
      "false",
      "boolean",
      "Enable maintenance mode",
      "system",
    ],
    [
      "registration_enabled",
      "true",
      "boolean",
      "Allow new user registrations",
      "system",
    ],
    [
      "booking_enabled",
      "true",
      "boolean",
      "Allow users to create bookings",
      "system",
    ],
    [
      "payment_enabled",
      "true",
      "boolean",
      "Enable payment processing",
      "system",
    ],

    // Notification Settings
    [
      "email_notifications",
      "true",
      "boolean",
      "Enable email notifications",
      "notifications",
    ],
    [
      "sms_notifications",
      "false",
      "boolean",
      "Enable SMS notifications",
      "notifications",
    ],
    [
      "push_notifications",
      "true",
      "boolean",
      "Enable push notifications",
      "notifications",
    ],

    // Content Settings
    [
      "max_upload_size",
      "10",
      "number",
      "Maximum file upload size in MB",
      "content",
    ],
    [
      "allowed_file_types",
      '["jpg","jpeg","png","gif","pdf"]',
      "json",
      "Allowed file types for uploads",
      "content",
    ],
    [
      "max_images_per_package",
      "10",
      "number",
      "Maximum images per package",
      "content",
    ],

    // Booking Settings
    [
      "min_booking_advance_days",
      "3",
      "number",
      "Minimum days in advance for booking",
      "booking",
    ],
    [
      "max_booking_advance_days",
      "365",
      "number",
      "Maximum days in advance for booking",
      "booking",
    ],
    [
      "cancellation_deadline_hours",
      "48",
      "number",
      "Hours before trip for free cancellation",
      "booking",
    ],
    [
      "auto_confirm_bookings",
      "false",
      "boolean",
      "Automatically confirm bookings",
      "booking",
    ],

    // Payment Settings
    ["currency", "ETB", "string", "Default currency code", "payment"],
    ["payment_gateway", "chapa", "string", "Active payment gateway", "payment"],
    [
      "commission_rate",
      "10",
      "number",
      "Platform commission rate (%)",
      "payment",
    ],
    [
      "refund_processing_days",
      "7",
      "number",
      "Days to process refunds",
      "payment",
    ],

    // Security Settings
    [
      "session_timeout_minutes",
      "60",
      "number",
      "Session timeout in minutes",
      "security",
    ],
    [
      "max_login_attempts",
      "5",
      "number",
      "Maximum failed login attempts",
      "security",
    ],
    [
      "password_min_length",
      "8",
      "number",
      "Minimum password length",
      "security",
    ],
    [
      "require_email_verification",
      "false",
      "boolean",
      "Require email verification for new users",
      "security",
    ],
  ];

  for (const setting of defaultSettings) {
    await connection.query(
      `INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       setting_value = VALUES(setting_value),
       description = VALUES(description)`,
      setting,
    );
  }

  // Add foreign key constraint for users.role_id
  await connection
    .query(
      `
    ALTER TABLE users 
    ADD CONSTRAINT fk_users_role 
    FOREIGN KEY (role_id) REFERENCES roles(id)
  `,
    )
    .catch(() => {}); // Ignore if constraint already exists
};

export default pool;
