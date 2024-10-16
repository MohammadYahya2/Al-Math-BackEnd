const express = require("express");
const {
  createComment,
  getCommentsByDocId,
  updateComment,
  deleteComment,
} = require("../controllers/comments");
const authenticate = require("../middlewares/authenticate"); // Assuming there's an authentication middleware

const router = express.Router();

// Create a new comment
router.post("/", authenticate, createComment);

// Get all comments for a specific document by docId
router.get("/doc/:docId", getCommentsByDocId);

// Update a comment by comment ID
router.put("/:id", authenticate, updateComment);

// Delete a comment by comment ID
router.delete("/:id", authenticate, deleteComment);

module.exports = router;
