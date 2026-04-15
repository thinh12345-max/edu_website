const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  pdfUrl: String,
});

module.exports = mongoose.model("Book", BookSchema);