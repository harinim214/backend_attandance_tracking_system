import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  registerStudent,
  markAttendance,
  getMyAttendance,
  getAttendanceAnalytics,
  getTodayAttendance,
  getStudentDashboard
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", registerStudent);

router.post(
  "/mark-attendance",
  authMiddleware,
  roleMiddleware(["student"]),
  markAttendance
);

router.get(
  "/my-attendance",
  authMiddleware,
  roleMiddleware(["student"]),
  getMyAttendance
);
router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware(["student"]),
  getAttendanceAnalytics
);

router.get(
  "/today",
  authMiddleware,
  roleMiddleware(["student"]),
  getTodayAttendance
);
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["student"]),
  getStudentDashboard
);

export default router;