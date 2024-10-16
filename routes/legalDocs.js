const express = require("express");
const {
  uploadDoc,
  getDocsByType,
  deleteDoc,
  getDocById,
} = require("../controllers/legalDocs.js");
const upload = require("../middlewares/upload.js"); // Multer middleware

const router = express.Router();

// router.get("/", getAllUsers);
router.post("/upload", upload.single("file"), uploadDoc);
router.get("/type/:type", getDocsByType);
router.get("/:id", getDocById);

router.delete("/:id", deleteDoc);

module.exports = router;
