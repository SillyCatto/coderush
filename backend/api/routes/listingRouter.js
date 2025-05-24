const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.models");
const { authUserToken } = require("../middlewares/authToken"); // auth
const upload = require("../utils/multer"); // For image uploads

/**
 * GET /api/listings/:userId
 * Retrieves all listings created by the current user
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {string} userId - ID of the user whose listings to retrieve
 * @returns {object} Array of user's listings with count
 * @throws {500} If server error occurs
 */
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

/**
 * GET /api/listings
 * Retrieves and filters listings with pagination
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=10] - Number of items per page (max 10)
 * @param {string} [type] - Filter by listing type (item/service)
 * @param {string} [category] - Filter by category
 * @param {string} [condition] - Filter by item condition
 * @param {string} [university] - Filter by university
 * @param {string} [visibility] - Filter by visibility setting
 * @param {boolean} [biddingEnabled] - Filter by bidding status
 * @param {number} [minPrice] - Filter by minimum price
 * @param {number} [maxPrice] - Filter by maximum price
 * @param {string} [search] - Search term for text search
 * @returns {object} Listings and pagination information
 * @throws {500} If server error occurs
 */
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


/**
 * POST /api/listings/add
 * Creates a new listing
 *
 * @middleware {function} authUserToken - Verifies the authenticated user
 * @middleware {function} upload.array - Handles image uploads (max 3)
 * @param {string} title - Listing title
 * @param {string} description - Listing description
 * @param {string} type - Listing type (item/service)
 * @param {number} price - Price for item or hourly rate for service
 * @param {string} condition - Condition of the item
 * @param {string} category - Listing category
 * @param {string} [visibility=university] - Visibility setting (university/global)
 * @param {boolean} biddingEnabled - Whether bidding is enabled
 * @returns {object} Created listing details
 * @throws {400} If required fields are missing
 * @throws {500} If server error occurs
 */
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
        biddingEnabled,
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
        images: req.files?.map((file) => file.path) || [],
        biddingEnabled: biddingEnabled === "true",
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
