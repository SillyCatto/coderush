/**
 * Token Authentication middleware
 * Handles user authentication by validating JWT tokens
 * @module AuthToken
 */
const { validateToken } = require("../utils/jwt");
const User = require("../models/user.models.js");

/**
 * User token authentication middleware
 *
 * @function authUserToken
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Request cookies
 * @param {String} req.cookies.token - JWT token stored in cookies
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns error response or calls next() to proceed
 * @throws {Error} - If token is invalid or user not found
 *
 * @description
 * Validates JWT token from cookies against the database.
 * If valid, attaches the user object to the request and proceeds.
 * If invalid, returns appropriate error responses.
 */
const authUserToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Please login first" });
    }

    const { _id } = validateToken(token);

    const user = await User.findById(_id);
    if (!user) throw new Error("Invalid auth token");

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  authUserToken,
};
