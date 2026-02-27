import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  date: String,
  session: String,
  status: String,
  month: Number,
  year: Number,
  approved: { type: String, default: "pending" }
});

// 🔥 Prevent duplicate attendance
attendanceSchema.index(
  { studentId: 1, subjectId: 1, date: 1, session: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);