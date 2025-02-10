const mongoose = require('mongoose');

const BidHistorySchema = new mongoose.Schema({
  bidId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the `Bid` model (ObjectId type)
    ref: 'Bid',                            // The reference to the `Bid` model
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
