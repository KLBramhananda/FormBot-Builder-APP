// card.js (Mongoose model)

const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  data: { type: Object, required: true }
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
