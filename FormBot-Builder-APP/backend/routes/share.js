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
    const { sharedBy, sharerUsername, inviteeEmail, permission, dashboardData } = req.body;
    
    const invitee = await User.findOne({ email: inviteeEmail });
    if (!invitee) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const share = new Share({
      sharedBy,
      sharerUsername,
      inviteeEmail,
      permission,
      dashboardData
    });
    
    await share.save();
    res.status(201).json({ message: 'Invite sent successfully', share });
  } catch (error) {
    res.status(500).json({ message: 'Error sending invite' });
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

router.get('/:shareId', async (req, res) => {
  try {
    const share = await Share.findById(req.params.shareId);
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }
    res.json(share);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving share' });
  }
});

router.get('/verify-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find share by token
    const share = await Share.findOne({ token });
    
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    // Return share data
    res.json({
      sharedBy: share.sharedBy,
      sharerUsername: share.sharerUsername,
      permission: share.permission
    });
  } catch (error) {
    console.error('Error verifying share token:', error);
    res.status(500).json({ message: 'Error verifying share token' });
  }
});

module.exports = router;