const { legalDocs, users, comments } = require("../models"); // Import models

async function uploadDoc(req, res) {
  try {
    const { type } = req.body; // Get document type from request body
    const file = req.file; // File uploaded using multer

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create a new LegalDoc
    const newDoc = await legalDocs.create({
      file: file.buffer, // File stored as binary (BLOB)
      type: type,
    });

    // Set the response type to PDF (or the actual type of the file)
    res.setHeader("Content-Type", "application/pdf"); // Adjust if necessary

    // Respond with a success message and the document itself
    res.status(201).json({
      message: "success",
      docId: newDoc.id,
      file: file.buffer.toString("base64"), // Convert buffer to base64 string
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
}
// Function to get documents by type
async function getDocsByType(req, res) {
  try {
    const { type } = req.params; // Get type from URL params

    // Find all documents of the given type
    const docs = await legalDocs.findAll({
      where: { type: type },
      include: [
        {
          model: comments, // Include associated comments
          include: [
            {
              model: users, // Include associated user for each comment
              attributes: ["username"], // Only return the username
            },
          ],
        },
      ],
    });

    if (docs.length === 0) {
      return res
        .status(404)
        .json({ message: "No documents found for this type" });
    }

    // Convert each document's file buffer to Base64
    const docsWithBase64 = docs.map((doc) => ({
      ...doc.toJSON(),
      file: doc.file.toString("base64"), // Convert buffer to base64 string
    }));

    res.status(200).json(docsWithBase64);
  } catch (error) {
    console.error("Error fetching documents by type:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
}
async function getDocById(req, res) {
  try {
    const { id } = req.params; // Get document ID from URL params
    const doc = await legalDocs.findByPk(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.setHeader("Content-Type", "application/pdf"); // Set the correct content type
    res.send(doc.file); // Send the binary file back to the client
  } catch (error) {
    console.error("Error retrieving document:", error);
    res.status(500).json({ error: "Failed to retrieve document" });
  }
}

async function deleteDoc(req, res) {
  try {
    const { id } = req.params;

    const doc = await legalDocs.findByPk(id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    await doc.destroy();

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
}

module.exports = {
  uploadDoc,
  getDocsByType,
  deleteDoc,
  getDocById,
};
