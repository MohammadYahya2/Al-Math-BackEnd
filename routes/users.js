const express = require("express");
const {
  getAllUsers,
  signUp,
  signIn,
  signOut,
} = require("../controllers/users.js");

const router = express.Router();

router.get("/", getAllUsers);
// router.get("/:id", getUserById);
router.post("/signup", signUp);
router.post("/signin", signIn);
router.put("/signout", signOut);

module.exports = router;
