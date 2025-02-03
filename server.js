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
      userid: customUserId,
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
    });

    const savedUser = await newUser.save();

    const token = generateOTP();
    otpStore[phone] = token;

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
    return res.status(400).json({ success: false, message: "OTP and mobile number are required." });
  }

  if (otpStore[mobileNumber] && otpStore[mobileNumber] === otp) {
    res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
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

app.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// PATCH Route to update user details by email
app.patch("/user/:email", async (req, res) => {
  const { email } = req.params;  // Get the email from the route parameters
  const updateFields = req.body;  // Get the fields to update from the request body

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update only the provided fields
    for (let key in updateFields) {
      if (updateFields.hasOwnProperty(key) && key !== 'password') { // Prevent overwriting of password field directly
        user[key] = updateFields[key];
      }
    }

    // If the password is being updated, hash it before saving
    if (updateFields.password) {
      const hashedPassword = await bcrypt.hash(updateFields.password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server setup
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
