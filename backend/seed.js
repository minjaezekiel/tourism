require("dotenv").config()
const mongoose = require("mongoose");
const User = require("./models/users"); // adjust if path differs
const user = process.env.MONGO_USER
const pass = process.env.MONGO_PASS
const host = process.env.MONGO_HOST


 
const MONGO_URI = `mongodb://${user}:${encodeURIComponent(pass)}@${host}?authSource=admin`
// 👆 I added a database name (IMPORTANT)

const seedAdmin = async () => {
  try {
    // =======================
    // CONNECT TO DATABASE
    // =======================
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // =======================
    // CHECK IF ADMIN EXISTS
    // =======================
    const existingAdmin = await User.findOne({ isAdmin: true });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists:");
      console.log(`   Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // =======================
    // CREATE ADMIN
    // =======================
    const admin = new User({
      first_name: "LightOne",
      last_name: "Admin",
      username: "admin",
      email: "lightoneadmin@gmail.com",
      password: "123456789", // auto-hashed by pre-save hook
      isAdmin: true
    });

    await admin.save();

    console.log("✅ Admin user created successfully");
    console.log({
      email: admin.email,
      username: admin.username,
      isAdmin: admin.isAdmin
    });

    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();