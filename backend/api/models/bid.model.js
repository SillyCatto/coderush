const mongoose = require("mongoose");

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
