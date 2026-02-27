import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
  getStaffDetails,
  getStaffWorkload,

  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getStudentDetails,
  
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,

  getAdminDashboard,
  getAttendanceReport
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/staff", authMiddleware, roleMiddleware(["admin"]), getAllStaff);
router.post("/staff", authMiddleware, roleMiddleware(["admin"]), upload.single("profileImage"), createStaff);
router.put("/staff/:id", authMiddleware, roleMiddleware(["admin"]), upload.single("profileImage"), updateStaff);
router.delete("/staff/:id", authMiddleware, roleMiddleware(["admin"]), deleteStaff);
router.get("/staff/:id", authMiddleware, roleMiddleware(["admin"]), getStaffDetails);


router.get("/students", authMiddleware, roleMiddleware(["admin"]), getAllStudents);
router.post("/students", authMiddleware, roleMiddleware(["admin"]), upload.single("profileImage"), createStudent);
router.put("/students/:id", authMiddleware, roleMiddleware(["admin"]), upload.single("profileImage"), updateStudent);
router.delete("/students/:id", authMiddleware, roleMiddleware(["admin"]), deleteStudent);
router.get("/students/:id", authMiddleware, roleMiddleware(["admin"]), getStudentDetails);


router.get("/subjects", authMiddleware, roleMiddleware(["admin"]), getAllSubjects);
router.post("/subjects", authMiddleware, roleMiddleware(["admin"]), createSubject);
router.put("/subjects/:id", authMiddleware, roleMiddleware(["admin"]), updateSubject);
router.delete("/subjects/:id", authMiddleware, roleMiddleware(["admin"]), deleteSubject);


router.get("/reports",authMiddleware,roleMiddleware(["admin"]),getAttendanceReport);

router.get("/dashboard", authMiddleware, roleMiddleware(["admin"]), getAdminDashboard);
router.get("/staff-workload", authMiddleware, roleMiddleware(["admin"]), getStaffWorkload);

export default router;