const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  entry_fee: {
    type: Number,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,  
  },

  updated_at: {
    type: Date,
    default: Date.now,  
  },

  first_prize: {
    type: Number,
    required: true,
  },

  second_prize: {
    type: Number,
    required: true,
  },

  game_type: {
    type: String,
    required: true,
  },
});


bidSchema.pre('save', function(next) {
  this.updated_at = Date.now(); 
  next();
});

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
