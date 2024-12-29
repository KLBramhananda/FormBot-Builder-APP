const express = require('express');
const Share = require('../models/Share');
const User = require('../models/User');
const router = express.Router();

// Test connection endpoint
router.get('/test', (req, res) => {
  try {
    res.json({ message: 'Share API is working' });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ message: 'Error in test endpoint' });
  }
});

// Verify email endpoint
router.get('/verify-email/:email', async (req, res) => {
  try {
    console.log('Verifying email:', req.params.email);
    const user = await User.findOne({ email: req.params.email });
    console.log('User found:', !!user);
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      message: 'Error verifying email',
      error: error.message 
    });
  }
});

// Send invite endpoint
router.post('/invite', async (req, res) => {
  try {
    console.log('Received invite request with body:', req.body);
    
    const { sharedBy, sharerUsername, inviteeEmail, permission } = req.body;
    
    // Validate required fields
    if (!sharedBy || !sharerUsername || !inviteeEmail || !permission) {
      console.error('Missing required fields:', { sharedBy, sharerUsername, inviteeEmail, permission });
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: { sharedBy, sharerUsername, inviteeEmail, permission }
      });
    }

    // Check if invitee exists
    console.log('Checking if invitee exists:', inviteeEmail);
    const invitee = await User.findOne({ email: inviteeEmail });
    console.log('Invitee found:', !!invitee);
    
    if (!invitee) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if share already exists
    console.log('Checking for existing share');
    const existingShare = await Share.findOne({
      sharedBy,
      inviteeEmail,
      type: 'invite'
    });

    let share;
    if (existingShare) {
      console.log('Updating existing share');
      existingShare.permission = permission;
      share = await existingShare.save();
    } else {
      console.log('Creating new share');
      share = new Share({
        sharedBy,
        sharerUsername,
        inviteeEmail,
        permission,
        type: 'invite'
      });
      share = await share.save();
    }
    
    console.log('Share saved successfully:', share);
    res.status(201).json({ 
      message: 'Invite sent successfully',
      share: share
    });
  } catch (error) {
    console.error('Full error details:', error);
    res.status(500).json({ 
      message: 'Error sending invite',
      error: error.message,
      stack: error.stack
    });
  }
});

// Create share link endpoint
router.post('/create-link', async (req, res) => {
  try {
    console.log('Received create-link request with body:', req.body);
    
    const { token, sharedBy, sharerUsername, permission } = req.body;
    
    if (!token || !sharedBy || !sharerUsername || !permission) {
      console.error('Missing required fields:', { token, sharedBy, sharerUsername, permission });
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: { token, sharedBy, sharerUsername, permission }
      });
    }

    const share = new Share({
      sharedBy,
      sharerUsername,
      inviteeEmail: 'public',
      token,
      permission,
      type: 'link'
    });

    console.log('Attempting to save share:', share);
    const savedShare = await share.save();
    console.log('Share saved successfully:', savedShare);
    
    res.status(201).json({ 
      message: 'Share link created successfully',
      share: savedShare
    });
  } catch (error) {
    console.error('Full error details:', error);
    res.status(500).json({ 
      message: 'Error creating share link',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;