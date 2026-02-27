
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";
import Student from "../models/Student.js";

/* ===========================
   LOGIN (Admin / Staff / Student)
=========================== */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        message: "Email and password required",
      });

    // Check Staff (includes Admin)
    let user = await Staff.findOne({ email });

    if (!user) {
      // Check Student
      user = await Student.findOne({ email });
    }

    if (!user)
      return res.status(400).json({
        message: "User not found",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    // Create JWT
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        department: user.department,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      role: user.role,
      name: user.name,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   VERIFY TOKEN (Optional)
=========================== */

export const verifyUser = async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      role: req.user.role,
      department: req.user.department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};