import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getMonthlyReport,
  getYearlyReport
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get(
  "/monthly",
  authMiddleware,
  roleMiddleware(["admin", "staff"]),
  getMonthlyReport
);

router.get(
  "/yearly",
  authMiddleware,
  roleMiddleware(["admin", "staff"]),
  getYearlyReport
);

export default router;