import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  createSubject,
  getSubjects
} from "../controllers/subjectController.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["admin"]),
  createSubject
);

router.get("/all", authMiddleware, getSubjects);

export default router;