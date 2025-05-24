const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.models");
const { authUserToken } = require("../middlewares/authToken"); // auth
const upload = require("../utils/multer"); // For image uploads

// @desc Get current user's listings
// @route GET /api/listings
// @access Private
router.get("/:userId", authUserToken, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user.id })
      .select("-__v") // Exclude version key
      .lean(); // Convert to plain JS object

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/", authUserToken, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Pagination config
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * limit;

    // Exclude user's own listings
    const userListings = await Listing.find({
      seller: loggedInUser._id,
    }).select("_id");

    const excludedListingIds = userListings.map((l) => l._id);

    // Build query dynamically
    const query = {
      _id: { $nin: excludedListingIds },
      status: "active",
    };

    // ===== FILTERS START =====

    if (req.query.type) {
      query.type = req.query.type; // item | service
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.condition) {
      query.condition = req.query.condition; // new | like_new | good | fair
    }

    if (req.query.university) {
      query.university = req.query.university;
    }

    if (req.query.visibility) {
      query.visibility = req.query.visibility; // university | global
    }

    if (req.query.biddingEnabled !== undefined) {
      query.biddingEnabled = req.query.biddingEnabled === "true";
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // ===== FILTERS END =====

    const listings = await Listing.find(query)
      .populate("seller", "name university avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Listing.countDocuments(query);

    res.json({
      data: listings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

router.post(
  "/add",
  authUserToken,
  upload.array("images", 3),
  async (req, res) => {
    try {
      const {
        title,
        description,
        type,
        price,
        condition,
        category,
        visibility,
      } = req.body;

      if (!title || !type || !category) {
        return res
          .status(400)
          .json({ error: "Title, type, and category are required" });
      }

      if (type === "item" && !price) {
        return res.status(400).json({ error: "Price is required for items" });
      }
      if (type === "service" && !price) {
        return res
          .status(400)
          .json({ error: "Hourly rate is required for services" });
      }

      const newListing = new Listing({
        title,
        description,
        type,
        price: type === "item" ? price : null,
        hourlyRate: type === "service" ? price : null,
        condition,
        category,
        visibility: visibility || "university",
        seller: req.user.id,
        university: req.user.university,
        images: req.files?.map((file) => file.path) || [], // ✅ Cloudinary URLs
      });

      const savedListing = await newListing.save();
      await savedListing.populate("seller", "name university");

      res.status(201).json({
        success: true,
        data: savedListing,
      });
    } catch (err) {
      console.error("Error creating listing:", err);
      res.status(500).json({
        success: false,
        error: "Server error while creating listing",
      });
    }
  },
);

// POST /api/listings/:id/bid
router.post("/:id/bids", authUserToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing || listing.status !== "active") {
      return res.status(404).json({ error: "Listing not found or inactive" });
    }

    if (!listing.biddingEnabled) {
      return res
        .status(400)
        .json({ error: "Bidding is not enabled for this listing" });
    }

    // Optional: Enforce that bid is higher than current highest
    const currentHighest = Math.max(
      ...listing.bids.map((b) => b.amount),
      listing.price || 0,
    );
    if (amount <= currentHighest) {
      return res.status(400).json({
        error: `Bid must be higher than current highest: ${currentHighest}`,
      });
    }

    listing.bids.push({
      user: req.user.id,
      amount,
    });

    await listing.save();

    res
      .status(200)
      .json({ success: true, message: "Bid placed successfully", listing });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ error: "Server error while placing bid" });
  }
});

module.exports = router;
