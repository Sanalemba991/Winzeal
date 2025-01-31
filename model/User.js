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
    type: String,  // Ensure user ID is a string
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

});

const User = mongoose.model("User", userSchema);

module.exports = User;
