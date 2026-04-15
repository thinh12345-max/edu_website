const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
});

module.exports = mongoose.model("Video", VideoSchema);