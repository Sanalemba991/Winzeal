const mongoose = require('mongoose');

const BidHistorySchema = new mongoose.Schema({
  userId: {
    type: String,  // `String` type for userId (as per your earlier design)
    ref: 'User',   // Reference to the `User` model
    required: true,
  },
  bidId: {
    type: mongoose.Schema.Types.ObjectId,  // Referencing the `Bid` model by ObjectId
    ref: 'Bid',                            // Reference to the `Bid` model
    required: true,
  },
  changes: {
    type: Object,  // Store the changes in the bid as an object
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Automatically set the current date for updates
  },
});

const BidHistory = mongoose.model('BidHistory', BidHistorySchema);

module.exports = BidHistory;
