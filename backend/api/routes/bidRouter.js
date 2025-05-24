const express = require("express");
const router = express.Router();
const Bid = require("../models/bid.model");
const Listing = require("../models/listing.models");
const { authUserToken } = require("../middlewares/authToken");

/**
 * POST /api/bids/add/:listingId
 * Places a new bid on a listing
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} listingId - ID of the listing to bid on
 * @param {number} amount - Bid amount
 * @returns {object} Confirmation message and bid details
 * @throws {400} If bid amount is invalid
 * @throws {403} If user tries to bid on their own listing or bidding is disabled
 * @throws {404} If listing is not found
 * @throws {409} If user has already placed a bid on the listing
 * @throws {500} If server error occurs
 */
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

/**
 * GET /api/bids/:listingID
 * Retrieves all bids for a specific listing
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} listingID - ID of the listing to get bids for
 * @returns {object} Listing title, total bid count, and bid details
 * @throws {400} If bidding is not enabled for the listing
 * @throws {404} If listing is not found
 * @throws {500} If server error occurs
 */
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
