const express = require("express");
const router = express.Router();

const Book = require("../models/book");
const Video = require("../models/video");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");


// =========================
// CLOUDINARY STORAGE - BOOK (PDF)
// =========================
const bookStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "edu/books",
    resource_type: "raw", // PDF / file
  },
});

const uploadBook = multer({ storage: bookStorage });


// =========================
// CLOUDINARY STORAGE - VIDEO
// =========================
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "edu/videos",
    resource_type: "video",
  },
});

const uploadVideo = multer({ storage: videoStorage });


// =========================
// 📘 UPLOAD BOOK (FIXED)
// =========================
router.post("/books", uploadBook.single("pdf"), async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      pdfUrl: req.file.path, // ✅ Cloudinary URL
    });

    await book.save();

    res.json({
      success: true,
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// =========================
// 🎬 UPLOAD VIDEO (FIXED)
// =========================
router.post("/videos", uploadVideo.single("video"), async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title,
      videoUrl: req.file.path, // ✅ Cloudinary URL
    });

    await video.save();

    res.json({
      success: true,
      data: video,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// =========================
// 📥 GET BOOKS
// =========================
router.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});


// =========================
// 📥 GET VIDEOS
// =========================
router.get("/videos", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});


// =========================
// 🗑 DELETE BOOK
// =========================
router.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted book" });
});


// =========================
// 🗑 DELETE VIDEO
// =========================
router.delete("/videos/:id", async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted video" });
});


module.exports = router;