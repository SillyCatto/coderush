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

    // Pagination configuration
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 10 ? 10 : limit; // More generous limit for listings
    const skip = (page - 1) * limit;

    // Get user's own listings to exclude
    const userListings = await Listing.find({
      seller: loggedInUser._id,
    }).select("_id");

    // Combine all listings to exclude
    const excludedListingIds = [...userListings.map((l) => l._id)];

    // Base query with filters
    const query = {
      _id: { $nin: excludedListingIds },
      status: "active", // Only show active listings
    };

    // Optional filters from query params
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.university) {
      query.university = req.query.university;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Get listings with populated seller info
    const listings = await Listing.find(query)
      .populate("seller", "name university avatar")
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
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
      const { title, description, type, price, category, visibility } =
        req.body;

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

module.exports = router;
