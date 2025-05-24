const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "marketplace",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({ storage: storage });

module.exports = parser;
