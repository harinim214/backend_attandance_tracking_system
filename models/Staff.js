import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  department: String,
  role: { type: String, default: "staff" }
});

const Staff =
  mongoose.models.Staff || mongoose.model("Staff", staffSchema);

export default Staff;