// folder.js (Mongoose model)

const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }
});

const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;
