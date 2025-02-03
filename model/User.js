const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },

  created_at: {
    type: Date,
    default: Date.now,  
  },

  updated_at: {
    type: Date,
    default: Date.now, 
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

 
  uniqueupiid: {
    type: String,
    default: "",

  },

  unique_name: {
    type: String,
    default: "",
   
  },

  upi_id: {
    type: String,
    default: "",

  },

  upi_name: {
    type: String,
    default: "",

  },

  acc_holder: {
    type: String,
    default: "",

  },

  is_bot: {
    type: String,
    default: "",  
  },

  bankname: {
    type: String,
    default: "",
  
  },

  pan_url: {
    type: String,
    default: "",

  },

  pan_number: {
    type: String,
    default: "",

  },

  aadhaar_url: {
    type: String,
    default: "",
 
  },

  kyc_status: {
    type: String,
    default: "",  
  },

  ip: {
    type: String,
    default: "",

  },

  location: {
    type: String,
    default: "", 
  },

  user_rank: {
    type: String,
    default: "",  
  },

});


userSchema.pre('save', function(next) {
  this.updated_at = Date.now(); 
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
