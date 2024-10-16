const { courses } = require("../models");

async function getCourses(req, res) {
  try {
    const allCourses = await courses.findAll(); // Fetch all courses from the database

    res.status(200).json(allCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
}

// Add a new course
async function addCourse(req, res) {
  try {
    const { name, description, zoomLink, location } = req.body;

    // Validate location field
    if (!["online", "onsite"].includes(location)) {
      return res
        .status(400)
        .json({ message: "Invalid location. Must be 'online' or 'onsite'." });
    }

    // If location is "onsite", zoomLink should be null
    const course = await courses.create({
      name,
      description,
      zoomLink: location === "online" ? zoomLink : null, // Only allow zoomLink for online courses
      location,
    });

    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
}

// Delete a course
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    // Find and delete the course by ID
    const course = await courses.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.destroy();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
}

module.exports = {
  addCourse,
  deleteCourse,
  getCourses,
};
