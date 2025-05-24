const express = require("express");
const router = express.Router();
const Bid = require("../models/bid.model");
const Listing = require("../models/listing.models");
const { authUserToken } = require("../middlewares/authToken");

// @desc Add a bid to a listing
// @route POST /api/bids/:listingId
// @access Private
router.post("/add/:listingId", authUserToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;
    const { amount } = req.body;

    // Validate input
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid bid amount is required." });
    }

    // Fetch the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    // Prevent bidding on own listing
    if (listing.seller.toString() === userId) {
      return res
        .status(403)
        .json({ error: "You cannot bid on your own listing." });
    }

    // Check if bidding is enabled
    if (!listing.biddingEnabled) {
      return res
        .status(403)
        .json({ error: "Bidding is not enabled on this listing." });
    }

    // Prevent duplicate bids from the same user
    const existingBid = await Bid.findOne({ listing: listingId, user: userId });
    if (existingBid) {
      return res
        .status(409)
        .json({ error: "You have already placed a bid on this listing." });
    }

    // Create and save the bid
    const bid = new Bid({
      listing: listingId,
      user: userId,
      amount,
    });

    await bid.save();

    // Optional: Add to embedded listing.bids array as well
    listing.bids.push({ user: userId, amount });
    await listing.save();

    res.status(201).json({
      success: true,
      message: "Bid placed successfully.",
      bid,
    });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ error: "Server error while placing bid." });
  }
});

// @desc Get all bids for a specific listing
// @route GET /bid/:listingID
// @access Private (or Public, depending on your app)
router.get("/:listingID", authUserToken, async (req, res) => {
  try {
    const { listingID } = req.params;

    const listing = await Listing.findById(listingID)
      .populate("bids.user", "name avatar university")
      .select("title bids biddingEnabled");

    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    if (!listing.biddingEnabled) {
      return res.status(400).json({
        success: false,
        error: "Bidding is not enabled for this listing",
      });
    }

    res.json({
      success: true,
      listingTitle: listing.title,
      totalBids: listing.bids.length,
      bids: listing.bids,
    });
  } catch (err) {
    console.error("Error fetching bids:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error while fetching bids" });
  }
});

module.exports = router;
