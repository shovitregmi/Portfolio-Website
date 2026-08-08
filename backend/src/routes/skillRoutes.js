const express = require("express");
const { listSkills, createSkill, updateSkill, deleteSkill } = require("../controllers/skillController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", listSkills);
router.post("/", requireAuth, createSkill);
router.put("/:id", requireAuth, updateSkill);
router.delete("/:id", requireAuth, deleteSkill);

module.exports = router;
