const express = require("express");
const { authUserToken } = require("../middlewares/authToken");
// const User = require("../models/user.models");

const userRouter = express.Router();

/**
 * GET /api/users/profile
 * Retrieves authenticated user's profile information
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @returns {object} User's profile data including ID, name, email, and other personal details
 * @throws {400} If error occurs retrieving profile information
 */
userRouter.get("/profile", authUserToken, async (req, res) => {
  try {
    const profileData = {
      userID: req.user._id,
      name: req.user.name,
      email: req.user.email,
      age: req.user.age,
      gender: req.user.gender,
      bio: req.user.bio,
      photoURL: req.user.photoURL,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };
    res.json({ profile: profileData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = userRouter;
