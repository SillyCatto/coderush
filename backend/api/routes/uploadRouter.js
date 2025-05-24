const express = require("express");
const router = express.Router();
const parser = require("../utils/multer");
const { sendSuccess, sendError } = require("../utils/response");

router.post("/", parser.single("image"), (req, res) => {
  if (!req.file) return sendError(res, 400, "No file uploaded");
  sendSuccess(res, 200, "Upload successful", { imageUrl: req.file.path });
});

module.exports = router;
