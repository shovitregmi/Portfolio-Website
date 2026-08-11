const express = require("express");
const {
  listExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", listExperiences);
router.post("/", requireAuth, createExperience);
router.put("/:id", requireAuth, updateExperience);
router.delete("/:id", requireAuth, deleteExperience);

module.exports = router;
