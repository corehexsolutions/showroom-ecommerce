const express = require("express");

const {
  submitConsultation,
} = require("../controllers/consultation.controller");

const router = express.Router();

router.post("/", submitConsultation);

module.exports = router;