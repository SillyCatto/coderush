const { validateToken } = require("../utils/jwt");
const User = require("../models/user.models.js");

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
