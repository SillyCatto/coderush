const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.models');
const { authUserToken } = require('../middlewares/authToken'); // auth

// @desc Get current user's listings
// @route GET /api/listings
// @access Private
router.get('/:userId', authUserToken, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user.id })
      .select('-__v') // Exclude version key
      .lean(); // Convert to plain JS object

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;