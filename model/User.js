const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Ensure username is unique
  },

  created_at: {
    type: String,  // Changed from Date to String
    default: Date.now().toString(),  // Default value as string representation of current date
  },
  
  updated_at: {
    type: String,  // Changed from Date to String
    default: Date.now().toString(),  // Default value as string representation of current date
  },

  userid: {
    type: String,
    required: false,
    unique: true,  // Ensure user ID is unique
  },

  player: {
    type: String,
    default: null,
  },

  usermail: {
    type: String,
    required: true,
    unique: true,  // Ensure usermail is unique
  },

  userphone: {
    type: String,
    default: null,
    unique: true,  // Ensure user phone is unique
  },

  password: {
    type: String,
    required: true,
  },

  OTPCode: {
    type: String,  // OTP code as a string
    default: null,
  },

  photo: {
    type: String,  // Assuming photo URL or path as string
    default: null,
  },

  refer_code: {
    type: String,  // Assuming referral code as string
    default: null,
  },

  used_refer_code: {
    type: String,  // Assuming used referral code as string
    default: null,
  },

  totalgem: {
    type: String,  // Total gems as string
    default: "0",
  },

  totalcoin: {
    type: String,  // Total coins as string
    default: "0",
  },

  playcoin: {
    type: String,  // Play coins as string
    default: "0",
  },

  wincoin: {
    type: String,  // Win coins as string
    default: "0",
  },

  device_token: {
    type: String,
    default: null,
  },

  registerDate: {
    type: String,
    default: null,
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
    type: String,  // Game played amount as string
    default: "0",
  },

  game_win_amount: {
    type: String,  // Game win amount as string
    default: "0",
  },

  HandGamePlayed: {
    type: String,  // Hand game played as string
    default: "0",
  },

  hg_win: {
    type: String,  // Hand game win amount as string
    default: "0",
  },

  twoPlayWin: {
    type: String,
    default: null,
  },

  FourPlayWin: {
    type: String,
    default: null,
  },

  twoPlayloss: {
    type: String,
    default: null,
  },

  FourPlayloss: {
    type: String,
    default: null,
  },

  status: {
    type: String,
    default: "active",  // Default status as "active"
  },

  banned: {
    type: String,
    default: "no",  // Default banned status as "no"
  },

  accountHolder: {
    type: String,
    default: null,
  },

  accountNumber: {
    type: String,
    default: null,
  },

  ifsc: {
    type: String,
    default: null,
  },

  uniquebankid: {
    type: String,
    default: null,
  },

  uniqueupiid: {
    type: String,
    default: null,  // Corrected to ensure it's set to null initially
    unique: true,   // Ensure the UPI ID is unique
  },

  unique_name: {
    type: String,
    unique: true,   // Ensure the unique name is unique
  },

  upi_id: {
    type: String,
    unique: true,   // Ensure the UPI ID is unique
  },

  upi_name: {
    type: String,
    unique: true,   // Ensure the UPI name is unique
  },

  acc_holder: {
    type: String,
    unique: true,   // Ensure the account holder name is unique
  },

  is_bot: {
    type: String,   // Changed from Number to String for consistency
  },

  bankname: {
    type: String,
    unique: true,   // Ensure the bank name is unique
  },

  pan_url: {
    type: String,
    unique: true,   // Ensure the PAN URL is unique
  },

  pan_number: {
    type: String,
    unique: true,   // Ensure the PAN number is unique
  },

  aadhaar_url: {
    type: String,
    unique: true,   // Ensure the Aadhaar URL is unique
  },

  kyc_status: {
    type: String,   // Changed from Number to String for consistency
  },

  ip: {
    type: String,
    unique: true,   // Ensure the IP address is unique
  },

  location: {
    type: String,
    unique: true,   // Ensure the location is unique
  },

  user_rank: {
    type: String,   // Changed from Number to String for consistency
  }

});

const User = mongoose.model("User", userSchema);

module.exports = User;
