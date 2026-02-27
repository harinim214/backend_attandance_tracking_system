import Subject from "../models/Subject.js";

export const createSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.json(subject);
};

export const getSubjects = async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
};
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("staffId", "name department");

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};