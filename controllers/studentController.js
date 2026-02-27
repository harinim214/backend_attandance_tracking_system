import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

/* =========================
   REGISTER STUDENT
========================= */
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, year, section } =
      req.body;

    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Student already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashed,
      rollNumber,
      department,
      year,
      section,
      role: "student",
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   MARK ATTENDANCE
========================= */
export const markAttendance = async (req, res) => {
  try {

    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", {
      weekday: "long"
    });

    const currentHour = today.getHours();

    const timetable = await Timetable.findOne({
      day: dayName,
      department: req.user.department,
      semester: req.user.semester
    });

    if (!timetable) {
      return res.status(404).json({
        message: "No class scheduled now"
      });
    }

    const exists = await Attendance.findOne({
      studentId: req.user.id,
      timetableId: timetable._id,
      date: today.toISOString().split("T")[0]
    });

    if (exists) {
      return res.status(400).json({
        message: "Already marked"
      });
    }

    const attendance = await Attendance.create({
      studentId: req.user.id,
      timetableId: timetable._id,
      status: "present",
      date: today.toISOString().split("T")[0],
      month: today.getMonth() + 1,
      year: today.getFullYear()
    });

    res.status(201).json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET MY ATTENDANCE
========================= */
export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({
      studentId: req.user.id,
    })
      .populate("subjectId")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAttendanceAnalytics = async (req, res) => {
  try {
    const { month, year } = req.query;

    const filter = {
      studentId: req.user.id
    };

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    const records = await Attendance.find(filter).populate("subjectId");

    const totalSessions = records.length;
    const presentSessions = records.filter(r => r.status === "present").length;

    const percentage =
      totalSessions === 0
        ? 0
        : ((presentSessions / totalSessions) * 100).toFixed(2);

    // Subject-wise percentage
    const subjectMap = {};

    records.forEach(record => {
      const subject = record.subjectId.subjectName;

      if (!subjectMap[subject]) {
        subjectMap[subject] = { total: 0, present: 0 };
      }

      subjectMap[subject].total += 1;

      if (record.status === "present") {
        subjectMap[subject].present += 1;
      }
    });

    const subjectWise = Object.keys(subjectMap).map(subject => ({
      subject,
      percentage:
        ((subjectMap[subject].present /
          subjectMap[subject].total) *
          100).toFixed(2)
    }));

    res.json({
      totalSessions,
      presentSessions,
      percentage,
      subjectWise
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const records = await Attendance.find({
      studentId: req.user.id,
      date: today
    });

    const morning = records.filter(r => r.session === "morning");
    const afternoon = records.filter(r => r.session === "afternoon");

    const morningStatus =
      morning.length > 0 && morning.every(r => r.status === "present")
        ? "Present"
        : morning.length > 0
        ? "Absent"
        : "No Class";

    const afternoonStatus =
      afternoon.length > 0 && afternoon.every(r => r.status === "present")
        ? "Present"
        : afternoon.length > 0
        ? "Absent"
        : "No Class";

    let overall = "Absent";

    if (morningStatus === "Present" && afternoonStatus === "Present")
      overall = "Full Day";
    else if (
      morningStatus === "Present" ||
      afternoonStatus === "Present"
    )
      overall = "Half Day";

    res.json({
      morningStatus,
      afternoonStatus,
      overall
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const records = await Attendance.find({
      studentId
    }).populate("subjectId");

    let present = 0;
    let absent = 0;

    records.forEach(r => {
      if (r.status === "present") present++;
      else absent++;
    });

    const total = present + absent;
    const percentage = total > 0
      ? ((present / total) * 100).toFixed(1)
      : 0;

    res.json({
      attendance: records,
      summary: { present, absent, percentage }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};