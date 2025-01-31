const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },

  created_at: {
    type: Date,
    default: Date.now,  // Automatically sets the creation timestamp
  },

  updated_at: {
    type: Date,
    default: Date.now,  // Sets the initial updated_at to the creation time
  },

  userid: {
    type: String,
    required: true,
    unique: true,
  },

  player: {
    type: String,
    default: "",
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    default: "",
    unique: true,
  },

  password: {
    type: String,
    required: true,
    default: "",
  },

  OTPCode: {
    type: String,
    default: "",
  },

  photo: {
    type: String,
    default: "",
  },

  refer_code: {
    type: String,
    default: "",
  },

  used_refer_code: {
    type: String,
    default: "",
  },

  totalgem: {
    type: String,
    default: "0",
  },

  totalcoin: {
    type: String,
    default: "0",
  },

  playcoin: {
    type: String,
    default: "0",
  },

  wincoin: {
    type: String,
    default: "0",
  },

  device_token: {
    type: String,
    default: "",
  },

  registerDate: {
    type: String,
    default: "",
  },

  refrelCoin: {
    type: String,
    default: "0",
  },

  GamePlayed: {
    type: String,
    default: "0",
  },

  game_played_amount: {
    type: String,
    default: "0",
  },

  game_win_amount: {
    type: String,
    default: "0",
  },

  HandGamePlayed: {
    type: String,
    default: "0",
  },

  hg_win: {
    type: String,
    default: "0",
  },

  twoPlayWin: {
    type: String,
    default: "",
  },

  FourPlayWin: {
    type: String,
    default: "",
  },

  twoPlayloss: {
    type: String,
    default: "",
  },

  FourPlayloss: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    default: "active",
  },

  banned: {
    type: String,
    default: "no",
  },

  accountHolder: {
    type: String,
    default: "",
  },

  accountNumber: {
    type: String,
    default: "",
  },

  ifsc: {
    type: String,
    default: "",
  },

  uniquebankid: {
    type: String,
    default: "",
  },

  // Removed unique constraint for fields that can be empty or optional
  uniqueupiid: {
    type: String,
    default: "",
    // Remove `unique: true` to allow empty or duplicate values
  },

  unique_name: {
    type: String,
    default: "",
    // Remove `unique: true` for fields that can be empty
  },

  upi_id: {
    type: String,
    default: "",
    // Remove `unique: true`
  },

  upi_name: {
    type: String,
    default: "",
    // Remove `unique: true`
  },

  acc_holder: {
    type: String,
    default: "",
    // Remove `unique: true`
  },

  is_bot: {
    type: String,
    default: "",  // Or you can set a boolean default: false, depending on your requirement
  },

  bankname: {
    type: String,
    default: "",
    // Removed unique: true
  },

  pan_url: {
    type: String,
    default: "",
    // Removed unique: true
  },

  pan_number: {
    type: String,
    default: "",
    // Removed unique: true
  },

  aadhaar_url: {
    type: String,
    default: "",
    // Removed unique: true
  },

  kyc_status: {
    type: String,
    default: "",  // Or set to a valid default status, e.g., "pending"
  },

  ip: {
    type: String,
    default: "",
    // Removed unique: true
  },

  location: {
    type: String,
    default: "",  // Or set to a placeholder value
  },

  user_rank: {
    type: String,
    default: "",  // Or another suitable default
  },

});

// Automatically update the `updated_at` field before saving the document
userSchema.pre('save', function(next) {
  this.updated_at = Date.now();  // Set updated_at to the current time whenever the document is saved
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
