require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { connectDB } = require("./config/db.js");
const path = require("path");// Testing lang

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
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use("/api/prescriptions", prescriptionRoutes);

// Testing lang
app.use(express.static(path.join(__dirname, "../client/dist")));

// Testing lang
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
