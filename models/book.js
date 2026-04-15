// models/book.js
const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema({
  title: String,
  pdfUrl: String,
  cloudinaryId: String, // Thêm dòng này
});
module.exports = mongoose.model("Book", BookSchema);