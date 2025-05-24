const express = require("express");
const router = express.Router();
const parser = require("../utils/multer");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * POST /api/upload
 * Uploads an image file
 *
 * @middleware {function} parser.single - Multer middleware for handling file upload
 * @param {File} image - Image file to upload
 * @returns {object} Success message and URL of uploaded image
 * @throws {400} If no file is uploaded
 */
router.post("/", parser.single("image"), (req, res) => {
  if (!req.file) return sendError(res, 400, "No file uploaded");
  sendSuccess(res, 200, "Upload successful", { imageUrl: req.file.path });
});

module.exports = router;
