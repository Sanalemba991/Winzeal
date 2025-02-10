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

// OTP and other utility functions
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

// Signup Route
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
      userid: customUserId,
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

// Verify OTP Route
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

// Bid Creation Route
app.post("/api/bid", async (req, res) => {
  try {
    const { userid, entry_fee, first_prize, second_prize, game_type } =
      req.body;

    const newBid = new Bid({
      userid,
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

// Get All Bids Route
app.get("/api/bids", async (req, res) => {
  try {
    const bids = await Bid.find().populate("userid", "name email");
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bids", error: err });
  }
});

// Update Bid with History Route
app.patch("/api/bid/user/:userid", async (req, res) => {
  try {
    const { userid } = req.params;  // The userId comes from the URL parameters
    const updateFields = req.body;  // The fields to update come from the request body

    // Find the existing bid by userId
    const bid = await Bid.findOne({ userid });

    if (!bid) {
      return res.status(404).json({ message: "Bid not found for the provided userid" });
    }

    // Create a history entry before updating the bid
    const bidHistory = new BidHistory({
      userId: userid,  // Store the userId
      bidId: bid._id,  // Store the bidId
      changes: { ...bid.toObject() },  // Capture the current state of the bid (before the update)
    });

    // Save the bid history entry
    await bidHistory.save();

    // Update the bid with the new fields
    for (let key in updateFields) {
      if (updateFields.hasOwnProperty(key)) {
        bid[key] = updateFields[key];  // Apply the updates to the bid
      }
    }

    // Save the updated bid
    await bid.save();

    // Return the updated bid
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

app.get("/api/bid/history/:userid", async (req, res) => {
  try {
    const { userid } = req.params;  

  
    const history = await BidHistory.find({ userId: userid }).sort({ updatedAt: -1 });

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
