// server.js (updated part)
const UltraORM = require('ultraorm');
const { User, Analytics, Blog, Contact, Gallery, Testimonials, Tours } = require("./models");

// Initialize UltraORM
const orm = new UltraORM({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'postgres',
  port: parseInt(process.env.DB_PORT) || 5432
});

// Register models
orm.registerModel(User);
orm.registerModel(Analytics);
orm.registerModel(Blog);
orm.registerModel(Contact);
orm.registerModel(Gallery);
orm.registerModel(Testimonials);
orm.registerModel(Tours);

// Make ORM available globally
global.orm = orm;

// ... rest of your server code

// Start server
const startServer = async () => {
  try {
    // Connect to PostgreSQL using UltraORM (NOT the old connectDB)
    await orm.connect();
    console.log("✅ Database connected successfully");
    
    // Sync all models (create tables)
    await orm.migrate();
    console.log("✅ All models synced");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();