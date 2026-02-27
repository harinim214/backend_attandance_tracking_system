import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true
  },

  department: String,
  semester: Number,
  academicYear: String,

  day: String,        // Monday
  timeSlot: String,   // 9:00-10:00
  room: String

}, { timestamps: true });

export default mongoose.models.Timetable ||
  mongoose.model("Timetable", timetableSchema);