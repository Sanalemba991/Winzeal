const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fast2sms = require("fast-two-sms");
const otplib = require("otplib");
const jwt = require("jsonwebtoken");
const UserModel = require("./model/User");
const Bid = require("./model/Bid");
const BidHistory = require("./model/BidHistory");

const authenticateJWT = require("./middlewares/authenticateJWT");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

let otpStore = {};

const generateOTP = () => {
  const secret = otplib.authenticator.generateSecret();
  return otplib.authenticator.generate(secret);
};

const sendMessage = async (mobile, token) => {
  const options = {
    authorization: process.env.FAST2SMS_API_KEY,
    message: `Your OTP verification code is ${token}`,
    numbers: [mobile],
  };

  try {
    const response = await fast2sms.sendMessage(options);
    return { success: true, message: "OTP sent successfully!" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP." };
  }
};

const { v4: uuidv4 } = require("uuid");


app.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const customUserId = "LUDO_" + phone;
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { customUserId }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      userId: customUserId,
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
    });

    const savedUser = await newUser.save();

    const token = generateOTP();
    otpStore[phone] = token;

    savedUser.OTPCode = token;
    await savedUser.save();

    const result = await sendMessage(phone, token);

    if (result.success) {
      res.status(201).json({
        userId: savedUser.userid,
        name: savedUser.name,
        email: savedUser.email,
        id: savedUser._id,
        otpSent: true,
        message: "User registered successfully. OTP sent to the phone.",
      });
    } else {
      res.status(500).json({ error: "Failed to send OTP." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/verify-otp", (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!otp || !mobileNumber) {
    return res
      .status(400)
      .json({ success: false, message: "OTP and mobile number are required." });
  }

  if (otpStore[mobileNumber] && otpStore[mobileNumber] === otp) {
    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

   
    user.playcoin = (parseInt(user.playcoin) + 1000).toString();  
    await user.save();

 
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "356d" });

    res.status(200).json({
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        playcoin: user.playcoin,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.post("/api/bid", async (req, res) => {
  try {
    const { userId, entry_fee, first_prize, second_prize, game_type } =
      req.body;

    const newBid = new Bid({
      userId,
      entry_fee,
      first_prize,
      second_prize,
      game_type,
    });

    await newBid.save();
    res.status(201).json({ message: "Bid created successfully", bid: newBid });
  } catch (err) {
    res.status(500).json({ message: "Failed to create bid", error: err });
  }
});
app.post("/api/bids", async (req, res) => {
  try {
    // Fetch all bids and populate userId with 'name' and 'email'
    const bids = await Bid.find().populate("userId", "name email");
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bids", error: err });
  }
});




app.patch("/api/bid/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;  
    const updateFields = req.body;  


    const bid = await Bid.findOne({ userId });

    if (!bid) {
      return res.status(404).json({ message: "Bid not found for the provided userid" });
    }

  
    const bidHistory = new BidHistory({
      userId: userId, 
      bidId: bid._id,  
      changes: { ...bid.toObject() },  
    });

  
    await bidHistory.save();


    for (let key in updateFields) {
      if (updateFields.hasOwnProperty(key)) {
        bid[key] = updateFields[key];  
      }
    }

  
    await bid.save();

    res.status(200).json({
      message: "Bid updated successfully",
      bid,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update bid",
      error: err.message,
    });
  }
});
app.post("/api/bid/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params; 

    const history = await BidHistory.find({ userId: userId }).sort({ updatedAt: -1 });

    if (history.length === 0) {
      return res.status(404).json({ message: "No history found for this user" });
    }

    res.status(200).json({
      message: "Bid history fetched successfully",
      history,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch bid history",
      error: err.message,
    });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
