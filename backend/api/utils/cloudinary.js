const cloudinary = require("cloudinary").v2;

// No need to call cloudinary.config() explicitly.
// It will automatically use the CLOUDINARY_URL from process.env.

module.exports = cloudinary;
