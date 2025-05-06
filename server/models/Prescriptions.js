require('dotenv').config();
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const prescriptionsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    dateOfPrescription: { type: String, required: true },

    // Updated: array of medicine objects
    inscription: {
      type: [medicineSchema],
      required: true,
    },

    instructions: { type: String, required: true },
    doctorInformation: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model("Prescription", prescriptionsSchema);

module.exports = Prescription;
