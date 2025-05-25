const mongoose = require("mongoose");

/**
 * Bid Schema
 *
 * @property {ObjectId} listing - Reference to the listing being bid on
 * @property {ObjectId} user - Reference to the user making the bid
 * @property {Number} amount - Bid amount (must be >= 0)
 * @property {Date} timestamp - When the bid was created (defaults to current time)
 * @property {Date} createdAt - Automatically tracked creation timestamp
 * @property {Date} updatedAt - Automatically tracked update timestamp
 */
const bidSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Bid amount must be greater than or equal to 0"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Optional: Prevent duplicate bids from same user on same listing (if needed)
// bidSchema.index({ listing: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Bid", bidSchema);
