import { seedDatabase } from "../seeders/completeSeedData.js";
import { initializeDatabase } from "../config/database.js";

const runSeeder = async () => {
  try {
    console.log("🚀 Starting database setup...");

    // Initialize database schema first
    await initializeDatabase();

    // Then seed with data
    await seedDatabase();

    console.log("🎉 Database setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Database setup failed:", error);
    process.exit(1);
  }
};

runSeeder();
