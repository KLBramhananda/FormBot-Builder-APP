const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  sharedBy: { 
    type: String, 
    required: true 
  },
  sharerUsername: { 
    type: String, 
    required: true 
  },
  inviteeEmail: { 
    type: String, 
    required: true 
  },
  permission: { 
    type: String, 
    required: true, 
    enum: ['Edit', 'View'] 
  },
  token: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ['invite', 'link'], 
    default: 'invite' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Share', shareSchema);