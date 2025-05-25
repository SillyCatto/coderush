const mongoose = require("mongoose");

/**
 * Meetup Schema
 *
 * @property {ObjectId} listing - Reference to the listing being transacted (required)
 * @property {ObjectId} buyer - Reference to the user buying the item/service (required)
 * @property {ObjectId} seller - Reference to the user selling the item/service (required)
 * @property {Object} meetupLocation - Location details for the meeting
 * @property {Number} meetupLocation.lat - Latitude coordinate (required)
 * @property {Number} meetupLocation.lng - Longitude coordinate (required)
 * @property {String} meetupLocation.name - Name or description of the location (required)
 * @property {String} status - Status of the meetup: "pending", "confirmed", or "completed" (defaults to "pending")
 * @property {Date} scheduledAt - When the meetup is scheduled to occur
 * @property {Date} createdAt - Automatically tracked creation timestamp
 * @property {Date} updatedAt - Automatically tracked update timestamp
 */
const meetupSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing is required"],
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },
    meetupLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed"],
      default: "pending",
    },
    scheduledAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Meetup", meetupSchema);
