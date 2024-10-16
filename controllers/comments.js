const { comments, users, legalDocs } = require("../models");

// Create a new comment
async function createComment(req, res) {
  try {
    const { text, docId } = req.body;

    // Check if the document exists before adding the comment
    const document = await legalDocs.findByPk(docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Create and save the new comment
    const newComment = await comments.create({
      text,
      docId,
      userId: req.user.userId,
    });

    res.status(201).json({
      message: "success",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
}

async function getCommentsByDocId(req, res) {
  try {
    const { docId } = req.params;

    // Fetch all comments for the given document ID, including associated user and document
    const docComments = await comments.findAll({
      where: { docId },
      include: [
        {
          model: legalDocs, // Optionally include document details
        },
        {
          model: users, // Include the associated user
          attributes: ["username"], // Only select the username from the users table
        },
      ],
    });

    if (docComments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this document" });
    }

    res.status(200).json(docComments);
  } catch (error) {
    console.error("Error fetching comments by document ID:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

// Update a comment
async function updateComment(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Find the comment by ID
    const comment = await comments.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update the comment text
    comment.text = text;
    await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
}

// Delete a comment
async function deleteComment(req, res) {
  try {
    const { id } = req.params;

    // Find and delete the comment
    const comment = await comments.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.destroy();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
}

module.exports = {
  createComment,
  getCommentsByDocId,
  updateComment,
  deleteComment,
};
