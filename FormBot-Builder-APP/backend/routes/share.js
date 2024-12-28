// In routes/share.js
const express = require("express");
const Share = require('../models/Share');
const User = require("../models/User");
const router = express.Router();

// Verify email endpoint
router.get('/verify-email/:email', async (req, res) => {
  try {
    console.log('Verifying email:', req.params.email);
    const user = await User.findOne({ email: req.params.email });
    console.log('User found:', !!user);
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
});

// Send invite endpoint
router.post('/invite', async (req, res) => {
  try {
    console.log('Invite request received with body:', req.body);
    
    // Validate required fields
    const { sharedBy, sharerUsername, inviteeEmail, permission } = req.body;
    
    if (!sharedBy || !sharerUsername || !inviteeEmail || !permission) {
      console.error('Missing required fields:', { sharedBy, sharerUsername, inviteeEmail, permission });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if invitee exists
    const invitee = await User.findOne({ email: inviteeEmail });
    console.log('Invitee found:', !!invitee);
    
    if (!invitee) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create share record
    const share = new Share({
      sharedBy,
      sharerUsername,
      inviteeEmail,
      permission,
      type: 'invite'
    });

    console.log('Attempting to save share:', share);
    const savedShare = await share.save();
    console.log('Share saved successfully:', savedShare);
    
    res.status(201).json({ message: 'Invite sent successfully' });
  } catch (error) {
    console.error('Full error details:', error);
    res.status(500).json({ 
      message: 'Error sending invite',
      error: error.message,
      details: error.toString()
    });
  }
});

// Create share link endpoint
router.post('/create-link', async (req, res) => {
  try {
    console.log('Create link request received with body:', req.body);
    
    const { token, sharedBy, sharerUsername, permission } = req.body;
    
    if (!token || !sharedBy || !sharerUsername || !permission) {
      console.error('Missing required fields:', { token, sharedBy, sharerUsername, permission });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const share = new Share({
      sharedBy,
      sharerUsername,
      inviteeEmail: 'public', // Used for public links
      token,
      permission,
      type: 'link'
    });

    console.log('Attempting to save share link:', share);
    const savedShare = await share.save();
    console.log('Share link saved successfully:', savedShare);
    
    res.status(201).json({ message: 'Share link created successfully' });
  } catch (error) {
    console.error('Full error details:', error);
    res.status(500).json({ 
      message: 'Error creating share link',
      error: error.message,
      details: error.toString()
    });
  }
});

// Add this route to check if sharing is working
router.get('/test', (req, res) => {
  res.json({ message: 'Share routes are working' });
});

module.exports = router;