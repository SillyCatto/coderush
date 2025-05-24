const User = require("../models/user.models.js");
const { sendError } = require("../utils/response");
const HTTP = require("../utils/httStatus");

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
