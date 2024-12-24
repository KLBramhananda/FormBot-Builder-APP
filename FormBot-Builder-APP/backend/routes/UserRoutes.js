const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Signup API
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Only check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        message: "Email already exists, please try to login!" 
      });
    }

    const newUser = new User({ 
      username,
      email, 
      password 
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error saving user. Please try again." });
  }
});

// Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: "Email does not exist. Please check once!" 
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ 
        message: "Password is Incorrect! Please check once!" 
      });
    }

    res.status(200).json({ 
      message: "Login successful", 
      userId: user._id,
      hasFormCreated: user.hasFormCreated 
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ 
      message: "An error occurred during login. Please try again." 
    });
  }
});

module.exports = router;