import Timetable from "../models/Timetable.js";

export const createTimetable = async (req, res) => {
  try {

    const timetable = await Timetable.create(req.body);
    res.status(201).json(timetable);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTimetable = async (req, res) => {
  try {

    const data = await Timetable.find()
      .populate("subjectId")
      .populate("staffId", "name");

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};