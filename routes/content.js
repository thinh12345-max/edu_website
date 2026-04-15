const express = require("express");
const router = express.Router();

const Book = require("../models/book");
const Video = require("../models/video");

const multer = require("multer");
const path = require("path");

const storageBook = multer.diskStorage({
  destination: "uploads/books",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadBook = multer({ storage: storageBook });

router.post("/books", uploadBook.single("pdf"), async (req, res) => {
  const book = new Book({
    title: req.body.title,
    pdfUrl: "/uploads/books/" + req.file.filename
  });

  await book.save();
  res.json(book);
});

const storageVideo = multer.diskStorage({
  destination: "uploads/videos",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadVideo = multer({ storage: storageVideo });

router.post("/videos", uploadVideo.single("video"), async (req, res) => {
  const video = new Video({
    title: req.body.title,
    videoUrl: "/uploads/videos/" + req.file.filename
  });

  await video.save();
  res.json(video);
});

// thêm sách
router.post("/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// xóa sách
router.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// thêm video
router.post("/videos", async (req, res) => {
  const video = new Video(req.body);
  await video.save();
  res.json(video);
});

// xóa video
router.delete("/videos/:id", async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// lấy danh sách sách
router.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// lấy danh sách video
router.get("/videos", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

module.exports = router;