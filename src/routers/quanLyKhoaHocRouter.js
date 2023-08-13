const express = require("express");
const multer = require("multer");
const quanLyKhoaHocController = require("../controllers/quanLyKhoaHocController");
const protect = require("../middlewares/protect");

const router = express.Router();
const upload = multer();

router.get("/LayDanhSachKhoaHoc", quanLyKhoaHocController.layDanhSachKhoaHoc);
router.post("/ThemDanhMucKhoaHoc", quanLyKhoaHocController.themDanhMucKhoaHoc);
router.post("/ThemKhoaHoc", upload.single("hinhAnh"), quanLyKhoaHocController.themKhoaHoc);

module.exports = router;
