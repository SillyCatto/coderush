const express = require("express");
const {
  validateSignupInput,
  validateLoginInput,
} = require("../middlewares/validateAuthInput");
const { encryptPassword } = require("../utils/encryptor");
const User = require("../models/user.models");
const { authUser } = require("../middlewares/authLogin");

const authRouter = express.Router();


/**
 * POST /api/auth/signup
 * Registers a new user in the system
 *
 * @middleware {function} validateSignupInput - Validates the signup form data
 * @returns {string} Confirmation message on successful registration
 * @throws {400} If validation fails or database error occurs
 */
authRouter.post("/signup", validateSignupInput, async (req, res) => {
  try {
    req.body.password = await encryptPassword(req.body.password);

    const user = new User(req.body);

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token
 *
 * @middleware {function} validateLoginInput - Validates the login credentials
 * @middleware {function} authUser - Verifies user credentials
 * @returns {object} User profile data and success message
 * @throws {400} If authentication fails
 */
authRouter.post("/login", validateLoginInput, authUser, async (req, res) => {
  try {
    const user = req.body.user;
    const token = await user.getJWT();

    const profileData = {
      userID: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      dept: user.dept,
      program: user.program,
      year: user.year,
      phone: user.phone,
      dob: user.dob,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res
      .cookie("token", token)
      .status(200)
      .json({
        success: true,
        message: "Login successful!",
        data: { user: profileData },
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/auth/logout
 * Logs out a user by clearing the authentication cookie
 *
 * @returns {object} Success message confirming logout
 */
authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .status(200)
    .json({ success: true, message: "Logout successful!" });
});

module.exports = authRouter;
