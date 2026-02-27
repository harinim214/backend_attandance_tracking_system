import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";

/* ================= DASHBOARD ================= */

export const getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.user._id;

    const subjects = await Subject.find({ staffIds: staffId });
    const subjectCount = subjects.length;

    const totalStudents = await Student.countDocuments({
      department: req.user.department
    });

    const today = new Date().toISOString().split("T")[0];

    const todayAttendance = await Attendance.countDocuments({
      staffId,
      date: today
    });

    res.json({ subjectCount, totalStudents, todayAttendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= MY SUBJECTS ================= */

export const getMySubjects = async (req, res) => {
  try {
    const staffId = req.user._id;

    console.log("Logged Staff ID:", staffId); // Debug

    const subjects = await Subject.find({
      staffIds: staffId
    });

    res.json(subjects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= STUDENTS BY SUBJECT ================= */

export const getStudentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.query;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const students = await Student.find({
      department: subject.department
    }).select("-password");

    res.json(students);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADD ATTENDANCE ================= */

export const addAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, status, session } = req.body;

    if (!studentId || !subjectId || !status || !session) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const today = new Date().toISOString().split("T")[0];
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const exists = await Attendance.findOne({
      studentId,
      subjectId,
      date: today,
      session
    });

    if (exists) {
      return res.status(400).json({ message: "Already marked for this session" });
    }

    const attendance = await Attendance.create({
      studentId,
      subjectId,
      staffId: req.user._id,
      date: today,
      session,
      status,
      month,
      year
    });

    res.status(201).json(attendance);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= APPROVE ================= */

export const approveAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Not found" });
    }

    attendance.approved = "approved";
    await attendance.save();

    res.json({ message: "Approved" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MONTHLY REPORT ================= */

export const getMonthlyReportStaff = async (req, res) => {
  try {
    const records = await Attendance.find({
      staffId: req.user._id
    }).populate("studentId");

    res.json(records);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ================= DEFAULTERS ================= */

export const getDefaulters = async (req, res) => {
  try {
    const records = await Attendance.find({
      staffId: req.user._id
    }).populate("studentId");

    const map = {};

    records.forEach(r => {
      const id = r.studentId._id;

      if (!map[id]) {
        map[id] = { total: 0, present: 0, name: r.studentId.name };
      }

      map[id].total++;
      if (r.status === "present") map[id].present++;
    });

    const defaulters = Object.values(map).filter(st => {
      const percent = (st.present / st.total) * 100;
      return percent < 75;
    });

    res.json(defaulters);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};