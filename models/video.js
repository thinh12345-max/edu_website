// models/book.js
const mongoose = require("mongoose");
const VideoSchema = new mongoose.Schema({
  title: String,
  pdfUrl: String,
  cloudinaryId: String, // Thêm dòng này
});
module.exports = mongoose.model("video", VideoSchema);