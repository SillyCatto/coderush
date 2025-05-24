const mongoose = require("mongoose");

/**
 * Listing Schema
 *
 * @property {String} title - Title of the listing (required, trimmed)
 * @property {String} description - Detailed description of the listing
 * @property {String} type - Type of listing: "item" or "service" (required)
 * @property {Number} price - Fixed price for the item
 * @property {Number} hourlyRate - Hourly rate for services
 * @property {String} condition - Condition of item: "new", "like_new", "good", or "fair"
 * @property {String} category - Category: "textbooks", "electronics", "furniture", "tutoring", or "other"
 * @property {String} visibility - Visibility scope: "university" or "global" (defaults to "university")
 * @property {ObjectId} seller - Reference to the user selling the item (required)
 * @property {String} university - University association for visibility filtering
 * @property {Array<String>} images - Array of image URLs for the listing
 * @property {String} status - Status of listing: "active", "sold", "expired", "updated", or "deleted" (defaults to "active")
 * @property {Boolean} biddingEnabled - Whether bidding is enabled (defaults to false)
 * @property {Array<Object>} bids - Array of bid objects with user, amount, and timestamp
 * @property {Date} createdAt - Automatically tracked creation timestamp
 * @property {Date} updatedAt - Automatically tracked update timestamp
 * @index {text} title, description - Text indexes for search functionality
 * @index {1} category, university, price - Compound index for filtering
 * @index {1} seller, status - Compound index for user listings filtering
 */
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
