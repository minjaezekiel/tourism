require('dotenv').config();
const bcrypt = require('bcrypt'); // ✅ Changed from 'bcryptjs' to match your controller
const { sequelize, User } = require('./models/models');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    // ✅ FIX: Destroy any existing admin so we can force-update the password
    await User.destroy({ where: { isAdmin: true } });
    console.log("🧹 Cleared old admin accounts...");

    // Hash the correct password
    const hashedPassword = await bcrypt.hash("123456789", 10);

    // Create fresh admin
    const admin = await User.create({
      first_name: "LightOne",
      last_name: "Admin",
      username: "admin",
      email: "silivestirassey@gmail.com",
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("✅ Admin user created successfully:");
    console.log(`   Username: ${admin.username}`);
 

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
