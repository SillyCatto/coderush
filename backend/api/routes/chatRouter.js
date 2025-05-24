const express = require("express");
const router = express.Router();
const { authUserToken } = require("../middlewares/authToken");
const User = require("../models/user.models");

// @desc Start a chat with another user (no DB storage required)
// @route GET /api/chat/:otherUserId
// @access Private
router.get("/chat/:otherUserId", authUserToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;

    if (userId === otherUserId) {
      return res.status(400).json({ error: "Cannot chat with yourself" });
    }

    // Optional: verify other user exists
    const otherUser = await User.findById(otherUserId).select(
      "name avatar university",
    );
    if (!otherUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Just acknowledge the chat route is valid — real-time handled by Socket.IO
    return res.json({
      success: true,
      currentUser: { id: userId },
      chattingWith: otherUser,
      message: "Chat ready to start",
    });
  } catch (err) {
    console.error("Error setting up chat:", err);
    return res.status(500).json({ error: "Server error setting up chat" });
  }
});

module.exports = router;
