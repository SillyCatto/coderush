/**
 * Authentication middleware
 * Handles user authentication by validating credentials
 * @module AuthLogin
 */

const User = require("../models/user.models.js");
const { sendError } = require("../utils/response");
const HTTP = require("../utils/httStatus");

/**
 * User authentication middleware
 *
 * @function authUser
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {String} req.body.email - User's email address
 * @param {String} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns error response or calls next() to proceed
 * @throws {Error} - If authentication service is unavailable
 *
 * @description
 * Validates user credentials against the database.
 * If valid, attaches the user object to the request body and proceeds.
 * If invalid, returns appropriate error responses.
 */
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return sendError(res, HTTP.BAD_REQUEST, "Invalid credentials");
    }

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return sendError(res, HTTP.BAD_REQUEST, "Invalid credentials");
    }

    req.body.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    sendError(res, HTTP.SERVER_ERROR, "Authentication service unavailable");
  }
};

module.exports = {
  authUser,
};
