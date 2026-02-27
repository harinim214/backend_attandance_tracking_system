import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  profileImage: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  rollNumber: String,
  department: String,
  year: String,
  section: String,
  role: { type: String, default: "student" }
});

export default mongoose.model("Student", studentSchema);