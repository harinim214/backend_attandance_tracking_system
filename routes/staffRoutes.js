import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getStaffDashboard,
  getMySubjects,
  getStudentsBySubject,
  addAttendance,
  approveAttendance,
  getMonthlyReportStaff,
  getDefaulters
} from "../controllers/staffController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, roleMiddleware(["staff"]), getStaffDashboard);

router.get("/my-subjects", authMiddleware, roleMiddleware(["staff"]), getMySubjects);

router.get("/students-by-subject", authMiddleware, roleMiddleware(["staff"]), getStudentsBySubject);

router.post("/add-attendance", authMiddleware, roleMiddleware(["staff"]), addAttendance);

router.put("/approve/:id", authMiddleware, roleMiddleware(["staff"]), approveAttendance);

router.get("/monthly-report", authMiddleware, roleMiddleware(["staff"]), getMonthlyReportStaff);

router.get("/defaulters", authMiddleware, roleMiddleware(["staff"]), getDefaulters);

export default router;