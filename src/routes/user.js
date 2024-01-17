const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

// Middleware to validate user input
const validateUser = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    // Email validation for correct email format ("foobar@gmail.com")
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format. Please provide a valid email" });
    }
    next();
};

// User Routes
router.post("/signup", validateUser, userController.signup);
router.post("/login", validateUser, userController.login);
router.get("/" , userController.getAllUsers);

router.post("/forgot-password" , userController.forgotPassword);
router.post("/reset-password" , userController.resetPassword);


module.exports = router;
