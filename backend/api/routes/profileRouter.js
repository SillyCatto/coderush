const express = require("express");
const { authUserToken } = require("../middlewares/authToken");
const User = require("../models/user.models");

const profileRouter = express.Router();

/**
 * GET /api/profile/:userID
 * Retrieves a user's profile information with privacy controls
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} userID - ID of the user whose profile to retrieve
 * @returns {object} User profile data with varying fields based on privacy settings
 * @throws {400} If user ID is invalid or other errors occur
 * @throws {404} If user is not found
 */
profileRouter.get("/:userID", authUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    if (!user) throw new Error("Invalid user ID");
    let profileData = {};
    if(user.share === false){
       profileData = {
          userID: user._id,
          name: user.name,
          email: user.email,
          dob: user.dob,
        };
    }else{
        profileData = {
          userID: user._id,
          name: user.name,
          email: user.email,
          university: user.university,
          dept: user.dept,
          program: user.program,
          year: user.year,
          phone: user.phone,
          dob: user.dob,
        };
    }

    res.status(200).json({
      success: true,
      message: "Profile get successful!",
      data: { user: profileData }, });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = profileRouter;
