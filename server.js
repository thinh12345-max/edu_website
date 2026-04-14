const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Post = require("./models/post");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ================= DB =================
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ KẾT NỐI MONGODB THÀNH CÔNG"))
  .catch(err => console.log("❌ LỖI DB:", err));
// ================= UPLOAD =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "pages") {
      cb(null, "uploads/pages/");
    } else if (file.mimetype === "application/pdf") {
      cb(null, "uploads/pdfs/");
    } else if (
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, "uploads/docs/");
    } else {
      cb(null, "uploads/videos/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).fields([
  { name: "video" },
  { name: "document" },
  { name: "pages" }, // 🔥 thêm
]);
// ================= API =================

// Lấy tất cả bài
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Đăng bài
app.post("/api/posts", upload, async (req, res) => {
  try {
    let videoUrl = req.body.videoLink || "";
    let pdfUrl = "";
    let docUrl = "";
    let pages = [];

    // VIDEO
    if (req.files.video) {
      videoUrl = "/uploads/videos/" + req.files.video[0].filename;
    }

    // DOCUMENT
    if (req.files.document) {
      const file = req.files.document[0];

      if (file.mimetype === "application/pdf") {
        pdfUrl = "/uploads/pdfs/" + file.filename;
      } else {
        docUrl = "/uploads/docs/" + file.filename;
      }
    }

    // 🔥 PAGES (nhiều ảnh)
    if (req.files.pages) {
      pages = req.files.pages.map((file) => "/uploads/videos/" + file.filename);
    }

    await Post.create({
      title: req.body.title,
      description: req.body.description,
      videoUrl,
      pdfUrl,
      docUrl,
      pages, // 🔥 lưu vào DB
    });

    res.send("OK");
  } catch (err) {
    console.log("LỖI:", err);
    res.status(500).send("Lỗi server");
  }
});

// Xóa
app.delete("/api/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// Sửa
app.put("/api/posts/:id", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
  });
  res.send("Updated");
});

app.listen(3000, () => console.log("http://localhost:3000"));
