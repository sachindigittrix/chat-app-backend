import { Sequelize } from "sequelize";

const DB_HOST =
  "ls-95282e5b08137042265e73cb11c9824b33ea27ea.cgsb992eevgt.ap-south-1.rds.amazonaws.com";
const DB_USERNAME = "development";
const DB_PASSWORD = "[kug9zSmmMkk~U`dP4:7k7BtP+1:xUq6";
const DB_NAME = "chat-app";
const DB_PORT = 3306;

// Ensure all required environment variables are set
if (!DB_NAME || !DB_USERNAME || !DB_PASSWORD || !DB_HOST) {
  throw new Error("❌ Missing required database environment variables.");
}

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || 3306, // Use .env port or default to 3306
  dialect: "mysql",
  logging: false, // Disable logging of SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
    process.exit(1);
  }
};
