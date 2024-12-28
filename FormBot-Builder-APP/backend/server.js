const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const shareRoutes = require("./routes/share");

require("dotenv").config();

const userRoutes = require("./routes/UserRoutes");

const app = express();
app.use("/api/share", shareRoutes);

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Log the MONGO_URI
console.log('Mongo URI:', process.env.MONGO_URI); // Check if this logs the correct Mongo URI

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err); // Print the exact error if any
  });