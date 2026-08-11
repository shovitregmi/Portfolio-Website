const express = require("express");
const {
  listEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", listEducation);
router.post("/", requireAuth, createEducation);
router.put("/:id", requireAuth, updateEducation);
router.delete("/:id", requireAuth, deleteEducation);

module.exports = router;
