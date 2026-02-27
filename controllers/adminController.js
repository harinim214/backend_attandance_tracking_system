import bcrypt, { hash } from "bcryptjs";
import Staff from "../models/Staff.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";

/* =========================
   STAFF CRUD
========================= */

// CREATE STAFF (Already exists but improved)

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingStaff = await Staff.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingStaff) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      department,
      profileImage: req.file ? req.file.filename : null
    });

    res.status(201).json(staff);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// GET ALL STAFF
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().select("-password");
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STAFF
/* ================= UPDATE STAFF ================= */
export const updateStaff = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    const existing = await Staff.findOne({
      email,
      _id: { $ne: req.params.id }
    });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        department,
        ...(req.file && { profileImage: req.file.filename })
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE STAFF
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   STUDENT MANAGEMENT
========================= */

// GET ALL STUDENTS


/* =========================
   DASHBOARD STATS
========================= */

export const dashboardStats = async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const staff = await Staff.countDocuments();

    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.countDocuments({
      date: today,
    });

    res.json({ students, staff, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ================= STUDENT ================= */

// Get All Students
export const getAllStudents = async (req, res) => {
  const students = await Student.find().select("-password");
  res.json(students);
};

// Update Student
export const updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// Delete Student
export const deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
};
/* ================= SUBJECT ================= */




// Get All Subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("staffIds", "name department");

    res.json(subjects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update Subject
/* ================= UPDATE SUBJECT ================= */
export const updateSubject = async (req, res) => {
  try {
    const {
      subjectName,
      department,
      academicYear,
      semester,
      staffIds
    } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        subjectName,
        department,
        academicYear,
        semester,
        staffIds  // 🔥 Update staffIds
      },
      { new: true }
    );

    res.json(subject);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};0

// Delete Subject
export const deleteSubject = async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ message: "Subject deleted" });
};

export const getAdminDashboard = async (req, res) => {
  try {
    const staffCount = await Staff.countDocuments();
    const studentCount = await Student.countDocuments();
    const subjectCount = await Subject.countDocuments();

    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = await Attendance.countDocuments({ date: today });

    res.json({
      staffCount,
      studentCount,
      subjectCount,
      todayAttendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= CREATE STUDENT ================= */

export const createStudent = async (req, res) => {
  try {
    const { name, email, password, department, year, section } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashed,
      department,
      year,
      section,
      role: "student",
      profileImage: req.file ? req.file.filename : ""
    });

    res.status(201).json(student);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ================= STAFF DETAILS ================= */
export const getStaffDetails = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-password");

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const subjects = await Subject.find({ staffId: staff._id });

    res.json({
      staff,
      subjects,
      totalSubjects: subjects.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentDetails = async (req, res) => {
  try {

    const student = await Student.findById(req.params.id)
      .select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const attendance = await Attendance.find({
      studentId: student._id
    }).populate("subjectId", "subjectName");

    const total = attendance.length;
    const present = attendance.filter(a => a.status === "present").length;
    const percentage = total > 0
      ? ((present / total) * 100).toFixed(2)
      : 0;

    res.json({
      student,
      attendance,
      summary: {
        total,
        present,
        absent: total - present,
        percentage
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createSubject = async (req, res) => {
  try {
    const {
      subjectName,
      department,
      academicYear,
      semester,
      staffIds
    } = req.body;

    const subject = await Subject.create({
      subjectName,
      department,
      academicYear,
      semester,
      staffIds   // 🔥 Save staffIds directly
    });

    res.status(201).json(subject);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffWorkload = async (req, res) => {
  try {

    const workload = await Staff.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "staffIds",
          as: "subjects"
        }
      },
      {
        $addFields: {
          workload: { $size: "$subjects" }
        }
      }
    ]);

    res.json(workload);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(filter).populate("studentId");

    const totalRecords = attendance.length;
    const present = attendance.filter(a => a.status === "present").length;
    const absent = attendance.filter(a => a.status === "absent").length;

    const percentage = totalRecords > 0
      ? ((present / totalRecords) * 100).toFixed(2)
      : 0;

    // Department-wise grouping
    const deptSummary = {};

    attendance.forEach(record => {
      const dept = record.studentId?.department || "Unknown";

      if (!deptSummary[dept]) {
        deptSummary[dept] = { present: 0, absent: 0 };
      }

      if (record.status === "present") {
        deptSummary[dept].present++;
      } else {
        deptSummary[dept].absent++;
      }
    });

    res.json({
      totalRecords,
      present,
      absent,
      percentage,
      deptSummary
    });

  } catch (error) {
    res.status(500).json({ message: "Report generation failed" });
  }
};