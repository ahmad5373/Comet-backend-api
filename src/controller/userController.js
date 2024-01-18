const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const crypto = require("crypto");
const sendMail = require("../middlewares/sendMail");

// To create a new user
exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, company, email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email: email, deletedAt: null },
    });

    if (existingUser) {
      return res.status(401).json({ error: "This Email is Already Exist."});
    }

    const encryptpassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      company,
      email,
      password: encryptpassword,
    });

    return res.status(200).json({ message: "User created successfully.", data: newUser, });

  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Error creating user",error: err.message, });
  }
};

//For login request
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({
      where: { email: email, deletedAt: null },
    });

    if (!userData) {
      return res.status(401).json({ error: "Incorrect Email Please Provide Valid Email Address", });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect Password", });
    }

    const payload = {
      user: { id: userData.id }
    }
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({ token, userData });
      }
    )

  } catch (err) {
    console.error("Error during login", err);
    res.status(500).json({ error: "Error during login",error: err.message, });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const Users = await User.findAll({ where: { deletedAt: null } })
    console.log("users", Users);
    res.status(200).json(Users)
  } catch (error) {
    console.log("Error while getting all users", error);
    res.status(500).json({ error: error.message })
  }
}

//Forgot-password 
exports.forgotPassword = async (req, res) => {
  try {
    console.log("req.body.email", req.body.email);

    const userData = await User.findOne({ where: { email: req.body.email } })

    if (!userData) {
      return res.status(404).json({ error: "User Not Found" })
    }

    //Generate Token for reset and expiration time 
    const resetToken = crypto.randomBytes(20).toString('hex');
    userData.resetPasswordToken = resetToken;
    userData.resetPasswordExpire = Date.now() + 3600000 // Token Expire in One hour 
    await userData.save();

    // Create a password reset link
    const resetLink = `http://127.0.0.1:5500/resetPassword.html/reset-password?token=${resetToken}`;

    //Compose email 
    const subject = "Password Reset Request";
    const html = `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`;

    await sendMail(userData.email, subject, html);

    res.status(200).json({ message: "Password reset link sent to your email " })
  } catch (error) {
    console.error("Error while processing forgot password request:", error.message);
    res.status(500).json({ error: error.message });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const userData = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!userData) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const resetPasswordExpire = userData.resetPasswordExpire;

    const currentTime = new Date();
    const expireTime = new Date(parseInt(resetPasswordExpire));

    if (expireTime < currentTime) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }


    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match." });
    }

    // Update Password with new Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    userData.password = hashedPassword;

    // Clear Reset Token Fields
    userData.resetPasswordToken = null;
    userData.resetPasswordExpire = null;

    await userData.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error while resetting password:", error.message);
    res.status(500).json({ error: error.message });
  }
};
