/**
 * Chat management router
 * Handles setting up chat sessions between users
 * @module chatRouter
 */

const express = require("express");
const router = express.Router();
const { authUserToken } = require("../middlewares/authToken");
const User = require("../models/user.models");

/**
 * GET /api/chat/:otherUserId
 * Initiates a chat session with another user
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} otherUserId - ID of the user to start chat with
 * @returns {object} Confirmation that chat is ready with user details
 * @throws {400} If user attempts to chat with themselves
 * @throws {404} If the other user is not found
 * @throws {500} If server error occurs during setup
 */
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
