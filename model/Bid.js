const mongoose = require('mongoose');


const BidSchema = new mongoose.Schema({
  userId: {
    type: String,  
    required: true,
  },
  entry_fee: {
    type: Number,
    required: true,
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
}, {
  timestamps: true,
});


const Bid = mongoose.model('Bid', BidSchema);

module.exports = Bid;
