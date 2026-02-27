import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  department: { type: String, required: true },
  academicYear: String,
  semester: Number,

  staffIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff"
    }
  ]
});

export default mongoose.model("Subject", subjectSchema);