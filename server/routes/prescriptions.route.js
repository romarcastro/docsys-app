require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
} = require("../controllers/prescriptions.controller.js");

router.get("/", getPrescriptions);

router.post("/", createPrescription);

router.put("/:id", updatePrescription);

router.delete("/:id", deletePrescription);

module.exports = router;
