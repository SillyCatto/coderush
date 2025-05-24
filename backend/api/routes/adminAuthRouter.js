const express = require("express");
const router = express.Router();
const User = require("../models/user.models");
const { sendError, sendSuccess } = require("../utils/response");
const HTTP = require("../utils/httStatus");
const { authUser } = require("../middlewares/authLogin");
const { authUserToken } = require("../middlewares/authToken");


/**
 * POST /api/adminAuth/login
 * Authenticates an administrator user
 *
 * @middleware {function} authUser - Verifies user credentials
 * @returns {object} Response with user details and JWT token
 * @throws {403} If user is not an admin
 * @throws {500} If login process fails
 */
// Admin login route
router.post("/login", authUser, async (req, res) => {
  try {
    const user = req.body.user;

    // Check if user has admin role
    if (user.role !== "admin") {
      return sendError(res, HTTP.FORBIDDEN, "Access denied. Admin privileges required.");
    }

    // Generate JWT token
    const token = user.getJWT();

    // Send success response with token
    sendSuccess(res, HTTP.OK, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error("Admin login error:", err);
    sendError(res, HTTP.SERVER_ERROR, "Admin login failed");
  }
});

/**
 * GET /api/adminAuth/verify
 * Verifies that a user has admin privileges
 *
 * @middleware {function} authUserToken - Verifies JWT token
 * @returns {object} Response with verification status and user details
 * @throws {401} If authentication fails
 * @throws {404} If user not found
 * @throws {403} If user is not an admin
 * @throws {500} If verification process fails
 */
// Verify admin status route
router.get("/verify", authUserToken, async (req, res) => {
  try {
    // Make sure req.user exists and has required properties
    if (!req.user || !req.user._id) {
      return sendError(res, HTTP.UNAUTHORIZED, "Authentication failed");
    }

    // Fetch the complete user data from the database
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return sendError(res, HTTP.NOT_FOUND, "User not found");
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return sendError(res, HTTP.FORBIDDEN, "Access denied. Admin privileges required.");
    }

    sendSuccess(res, HTTP.OK, {
      verified: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Admin verification error:", err);
    sendError(res, HTTP.SERVER_ERROR, "Admin verification failed");
  }
});


module.exports = router;