const express = require("express");
const router = express.Router();
const {
  addCourse,
  deleteCourse,
  getCourses,
} = require("../controllers/courses");

router.get("/", getCourses);

// Route to add a new course
router.post("/", addCourse);

// Route to delete a course by ID
router.delete("/:id", deleteCourse);

module.exports = router;
