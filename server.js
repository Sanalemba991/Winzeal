const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fast2sms = require("fast-two-sms");
const otplib = require("otplib");
const jwt = require("jsonwebtoken");
const UserModel = require("./model/User");

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

app.post("/signup", async (req, res) => {
  const { username, usermail, password, userphone } = req.body;

  try {
    if (!username || !usermail || !password || !userphone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ usermail });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      usermail,
      password: hashedPassword,
      userphone,  // Corrected from `phone` to `userphone`
    });

    const savedUser = await newUser.save();
    const token = generateOTP();
    otpStore[userphone] = token;

    const result = await sendMessage(userphone, token);
    if (result.success) {
      res.status(201).json({
        username: savedUser.username,  // Ensure the keys match the model
        usermail: savedUser.usermail,
        userphone: savedUser.userphone,
        id: savedUser._id,
        otpSent: true,
        message:
          "User registered successfully. OTP sent to the registered phone number.",
      });
    } else {
      res
        .status(500)
        .json({ error: "User registered, but failed to send OTP." });
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
      .json({ success: false, message: "Mobile number and OTP are required." });
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
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ usermail: email }); // Corrected to match the field name
    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: user.usermail, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "90d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
