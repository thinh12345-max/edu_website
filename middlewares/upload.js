const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Lưu PDF / file lên cloud
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "edu_website/books",
    resource_type: "raw", // QUAN TRỌNG cho PDF
    format: async () => "pdf",
  },
});

const upload = multer({ storage });

module.exports = upload;