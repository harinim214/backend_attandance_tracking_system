import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  createTimetable,
  getAllTimetable
} from "../controllers/timetableController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createTimetable
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAllTimetable
);

export default router;