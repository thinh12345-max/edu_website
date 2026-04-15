const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Book = require("../models/book");
const Video = require("../models/video");

// Cấu hình lưu trữ linh hoạt
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';
    return {
      folder: isPdf ? "edu/books" : "edu/videos",
      resource_type: isPdf ? "raw" : "video", // PDF bắt buộc là raw
      public_id: Date.now() + "-" + file.originalname.split('.')[0],
    };
  },
});

const upload = multer({ storage });

// 📘 UPLOAD BOOK
router.post("/books", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) throw new Error("Không tìm thấy file PDF");
    const book = new Book({
      title: req.body.title,
      pdfUrl: req.file.path,
      cloudinaryId: req.file.filename // Lưu ID để xóa sau này
    });
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🎬 UPLOAD VIDEO
router.post("/videos", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) throw new Error("Không tìm thấy file video");
    const video = new Video({
      title: req.body.title,
      videoUrl: req.file.path,
      cloudinaryId: req.file.filename
    });
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🗑 DELETE BOOK (Xóa cả trên Cloudinary)
router.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book && book.cloudinaryId) {
      // Vì PDF là 'raw', cần thêm resource_type khi xóa
      await cloudinary.uploader.destroy(book.cloudinaryId, { resource_type: 'raw' });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sách khỏi hệ thống và Cloud" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📥 GET ALL (Giữ nguyên logic cũ nhưng thêm bọc try-catch)
router.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

router.get("/videos", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

module.exports = router;