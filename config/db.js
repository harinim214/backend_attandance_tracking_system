import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Staff from "../models/Staff.js";

const createAdmin = async () => {
  try {
    const existingAdmin = await Staff.findOne({ role: "admin" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await Staff.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        department: "Management",
        role: "admin",
      });

      console.log("✅ Admin created successfully");
    } else {
      console.log("ℹ Admin already exists");
    }
  } catch (error) {
    console.error("Admin creation error:", error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    await createAdmin(); // ✅ Now it's defined above

  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;