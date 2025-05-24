const express = require("express");
const router = express.Router();
const Meetup = require("../models/meetup.models");
const Listing = require("../models/listing.models");
const { authUserToken } = require("../middlewares/authToken");
const { sendError, sendSuccess } = require("../utils/response");
const HTTP = require("../utils/httStatus");

/**
 * POST /api/meetups/add
 * Creates a new meetup between buyer and seller
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} listingId - ID of the listing for the meetup
 * @param {string} meetupLocation - Physical location for the meetup
 * @param {string|Date} scheduledAt - Date and time for the meetup
 * @returns {object} Created meetup details with populated seller, buyer and listing info
 * @throws {400} If required fields are missing
 * @throws {404} If listing is not found
 * @throws {500} If server error occurs
 */
router.post("/add", authUserToken, async (req, res) => {
  try {
    const { listingId, meetupLocation, scheduledAt } = req.body;

    if (!listingId || !meetupLocation || !scheduledAt) {
      return sendError(res, HTTP.BAD_REQUEST, "Missing required fields");
    }

    // Find the listing to get seller information
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return sendError(res, HTTP.NOT_FOUND, "Listing not found");
    }

    // Create the meetup
    const meetup = new Meetup({
      listing: listingId,
      buyer: req.user._id,
      seller: listing.seller,
      meetupLocation,
      scheduledAt: new Date(scheduledAt),
    });

    await meetup.save();

    // Populate seller and buyer info before sending response
    await meetup.populate([
      { path: "seller", select: "name email " },
      { path: "buyer", select: "name email " },
      { path: "listing", select: "title price images" },
    ]);

    sendSuccess(res, HTTP.CREATED, meetup);
  } catch (err) {
    console.error("Create meetup error:", err);
    sendError(res, HTTP.SERVER_ERROR, "Failed to create meetup");
  }
});

/**
 * GET /api/meetups/myMeetups
 * Retrieves all meetups for the authenticated user (as buyer or seller)
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @returns {object} Array of meetups with populated seller, buyer and listing info
 * @throws {500} If server error occurs
 */
router.get("/myMeetups", authUserToken, async (req, res) => {
  try {
    const meetups = await Meetup.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate("seller", "name email avatar")
      .populate("buyer", "name email avatar")
      .populate("listing", "title price images")
      .sort({ createdAt: -1 });

    sendSuccess(res, HTTP.OK, meetups);
  } catch (err) {
    console.error("Get meetups error:", err);
    sendError(res, HTTP.SERVER_ERROR, "Failed to fetch meetups");
  }
});

/**
 * GET /api/meetups/:id
 * Retrieves a specific meetup by ID
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} id - ID of the meetup to retrieve
 * @returns {object} Meetup details with populated seller, buyer and listing info
 * @throws {403} If user is not a participant in the meetup
 * @throws {404} If meetup is not found
 * @throws {500} If server error occurs
 */
router.get("/:id", authUserToken, async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id)
      .populate("seller", "name email avatar")
      .populate("buyer", "name email avatar")
      .populate("listing", "title price images");

    if (!meetup) {
      return sendError(res, HTTP.NOT_FOUND, "Meetup not found");
    }

    // Check if the user is authorized to view this meetup
    if (
      !meetup.buyer.equals(req.user._id) &&
      !meetup.seller.equals(req.user._id)
    ) {
      return sendError(
        res,
        HTTP.FORBIDDEN,
        "Not authorized to view this meetup",
      );
    }

    sendSuccess(res, HTTP.OK, meetup);
  } catch (err) {
    console.error("Get meetup error:", err);
    sendError(res, HTTP.SERVER_ERROR, "Failed to fetch meetup");
  }
});

/**
 * PATCH /api/meetups/:id/status
 * Updates the status of a meetup
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} id - ID of the meetup to update
 * @param {string} status - New status value (pending/confirmed/completed)
 * @returns {object} Updated meetup details
 * @throws {400} If status is invalid
 * @throws {403} If user is not authorized to change status
 * @throws {404} If meetup is not found
 * @throws {500} If server error occurs
 */
router.patch("/:id/status", authUserToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "confirmed", "completed"].includes(status)) {
      return sendError(res, HTTP.BAD_REQUEST, "Invalid status value");
    }

    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      return sendError(res, HTTP.NOT_FOUND, "Meetup not found");
    }

    // Only the seller can confirm or mark as completed
    if (
      (status === "confirmed" || status === "completed") &&
      !meetup.seller.equals(req.user._id)
    ) {
      return sendError(
        res,
        HTTP.FORBIDDEN,
        "Only the seller can update this status",
      );
    }

    // Update the status
    meetup.status = status;
    await meetup.save();

    await meetup.populate([
      { path: "seller", select: "name email " },
      { path: "buyer", select: "name email " },
      { path: "listing", select: "title price images" },
    ]);

    sendSuccess(res, HTTP.OK, meetup);
  } catch (err) {
    console.error("Update meetup status error:", err);
    sendError(res, HTTP.SERVER_ERROR, "Failed to update meetup status");
  }
});

/**
 * PUT /api/meetups/:id
 * Updates meetup details
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} id - ID of the meetup to update
 * @param {string} [location] - New meetup location
 * @param {string|Date} [scheduledAt] - New date and time for the meetup
 * @returns {object} Updated meetup details
 * @throws {400} If no updates provided or meetup is completed
 * @throws {403} If user is not a participant in the meetup
 * @throws {404} If meetup is not found
 * @throws {500} If server error occurs
 */
router.put("/:id", authUserToken, async (req, res) => {
  try {
    const { location, scheduledAt } = req.body;

    if (!location && !scheduledAt) {
      return sendError(res, HTTP.BAD_REQUEST, "No updates provided");
    }

    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      return sendError(res, HTTP.NOT_FOUND, "Meetup not found");
    }

    // Only participants can update
    if (
      !meetup.buyer.equals(req.user._id) &&
      !meetup.seller.equals(req.user._id)
    ) {
      return sendError(
        res,
        HTTP.FORBIDDEN,
        "Not authorized to update this meetup",
      );
    }

    // Cannot update completed meetups
    if (meetup.status === "completed") {
      return sendError(
        res,
        HTTP.BAD_REQUEST,
        "Cannot update completed meetups",
      );
    }

    // Update fields
    if (location) meetup.location = location;
    if (scheduledAt) meetup.scheduledAt = new Date(scheduledAt);

    await meetup.save();

    await meetup.populate([
      { path: "seller", select: "name email avatar" },
      { path: "buyer", select: "name email avatar" },
      { path: "listing", select: "title price images" },
    ]);

    sendSuccess(res, HTTP.OK, meetup);
  } catch (err) {
    console.error("Update meetup error:", err);
    sendError(res, HTTP.SERVER_ERROR, "Failed to update meetup");
  }
});

/**
 * DELETE /api/meetups/delete/:id
 * Deletes a meetup
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} id - ID of the meetup to delete
 * @returns {object} Success message
 * @throws {403} If user is not a participant in the meetup
 * @throws {404} If meetup is not found
 * @throws {500} If server error occurs
 */
router.delete("/delete/:id", authUserToken, async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      return sendError(res, HTTP.NOT_FOUND, "Meetup not found");
    }

    // Only participants can delete
    if (
      !meetup.buyer.equals(req.user._id) &&
      !meetup.seller.equals(req.user._id)
    ) {
      return sendError(
        res,
        HTTP.FORBIDDEN,
        "Not authorized to delete this meetup",
      );
    }

    await Meetup.findByIdAndDelete(req.params.id);

    sendSuccess(res, HTTP.OK, { message: "Meetup deleted successfully" });
  } catch (err) {
    console.error("Delete meetup error:", err);
    sendError(res, HTTP.SERVER_ERROR, "Failed to delete meetup");
  }
});

module.exports = router;
