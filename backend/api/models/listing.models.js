const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    type: { type: String, enum: ["item", "service"], required: true },
    price: Number,
    hourlyRate: Number,
    condition: {
      type: String,
      enum: ["new", "like_new", "good", "fair"],
    },
    category: {
      type: String,
      enum: ["textbooks", "electronics", "furniture", "tutoring", "other"],
    },
    visibility: {
      type: String,
      enum: ["university", "global"],
      default: "university",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    university: String, // Required for visibility filtering
    images: [String],
    status: {
      type: String,
      enum: ["active", "sold", "expired", "updated", "deleted"],
      default: "active",
    },
    // Optional for bidding system
    biddingEnabled: { type: Boolean, default: false },
    bids: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// Indexes for faster searching
listingSchema.index({ title: "text", description: "text" });
listingSchema.index({ category: 1, university: 1, price: 1 });
listingSchema.index({ seller: 1, status: 1 });

module.exports = mongoose.model("Listing", listingSchema);
