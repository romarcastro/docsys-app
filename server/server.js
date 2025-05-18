require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { connectDB } = require("./config/db.js");

const prescriptionRoutes = require("./routes/prescriptions.route.js");

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://docsys.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://prms-test.onrender.com",
      "https://pims-d.onrender.com",
      "https://pims-d-f.vercel.app",
      "https://simc-billing-system.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use("/api/prescriptions", prescriptionRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
