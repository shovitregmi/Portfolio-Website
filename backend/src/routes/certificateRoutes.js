const express = require("express");
const {
  listCertificates, createCertificate, updateCertificate, deleteCertificate,
} = require("../controllers/certificateController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", listCertificates);
router.post("/", requireAuth, createCertificate);
router.put("/:id", requireAuth, updateCertificate);
router.delete("/:id", requireAuth, deleteCertificate);

module.exports = router;
