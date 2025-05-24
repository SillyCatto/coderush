const express = require("express");
const { authUserToken } = require("../middlewares/authToken");
const User = require("../models/user.models");

const profileRouter = express.Router();

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
