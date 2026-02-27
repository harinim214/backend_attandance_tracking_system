import Attendance from "../models/Attendance.js";

export const getMonthlyReport = async (req, res) => {
  const { month, year } = req.query;

  const data = await Attendance.find({
    month,
    year,
    approved: "approved",
  }).populate("studentId subjectId");

  res.json(data);
};

export const getYearlyReport = async (req, res) => {
  const { year } = req.query;

  const data = await Attendance.find({
    year,
    approved: "approved",
  });

  res.json(data);
};