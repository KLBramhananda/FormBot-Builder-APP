const express = require("express");
const Share = require("../models/Share");
const User = require("../models/User");
const router = express.Router();

router.post("/invite", async (req, res) => {
  try {
    const { sharedBy, sharerUsername, inviteeEmail, permission } = req.body;

    const invitee = await User.findOne({ email: inviteeEmail });
    if (!invitee) {
      return res.status(404).json({ message: "User not found" });
    }

    const share = new Share({
      sharedBy,
      sharerUsername,
      inviteeEmail,
      permission,
    });

    await share.save();
    res.status(201).json({ message: "Invite sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending invite" });
  }
});

router.get("/shared-dashboards/:email", async (req, res) => {
  try {
    const shares = await Share.find({ inviteeEmail: req.params.email });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shared dashboards" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists, please try to login!",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error saving user. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email does not exist. Please check once!",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Password is Incorrect! Please check once!",
      });
    }

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      hasFormCreated: user.hasFormCreated,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "An error occurred during login. Please try again.",
    });
  }
});

router.post("/api/typebots/save", async (req, res) => {
  try {
    const { typebotId, formName, flowElements, theme, lastModified } = req.body;

    if (!typebotId || !flowElements) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const savedTypebot = await TypebotModel.findByIdAndUpdate(
      typebotId,
      {
        formName,
        flowElements,
        theme,
        lastModified,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: savedTypebot,
    });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save typebot" });
  }
});

module.exports = router;
