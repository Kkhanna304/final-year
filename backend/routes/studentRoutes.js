const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/upload");

const {
  getProfile,
  updateProfile,
  uploadPhoto,
  getDashboard
} = require("../controllers/studentController");

router.get("/profile", authMiddleware, getProfile);

router.put("/update-profile", authMiddleware, updateProfile);

router.post("/upload-photo", authMiddleware, upload.single("photo"), uploadPhoto);

// Dashboard API
router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;