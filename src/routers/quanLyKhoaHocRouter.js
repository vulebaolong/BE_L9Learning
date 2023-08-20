const express = require("express");
const multer = require("multer");
const quanLyKhoaHocController = require("../controllers/quanLyKhoaHocController");
const protect = require("../middlewares/protect");

const router = express.Router();
const upload = multer();

router.get("/LayDanhSachKhoaHoc", quanLyKhoaHocController.layDanhSachKhoaHoc);
router.get("/LayMotKhoaHoc", quanLyKhoaHocController.layMotKhoaHoc);
router.get("/LayKhoaHocTheoDanhMuc", quanLyKhoaHocController.layKhoaHocTheoDanhMuc);
router.post("/ThemDanhMucKhoaHoc", quanLyKhoaHocController.themDanhMucKhoaHoc);
router.get("/LayDanhMucKhoaHoc", quanLyKhoaHocController.layDanhMucKhoaHoc);
router.post("/ThemKhoaHoc", upload.single("hinhAnh"), quanLyKhoaHocController.themKhoaHoc);
router.delete("/XoaKhoaHoc", quanLyKhoaHocController.xoaKhoaHoc);
router.put("/CapNhatKhoaHoc", upload.single("hinhAnh"), quanLyKhoaHocController.capNhatKhoaHoc);

//! những dòng mã chạy sau sẽ đều có protect, vì chạy theo thứ tự
router.use(protect);
router.post("/DangKyKhoaHoc", quanLyKhoaHocController.dangKyKhoaHoc);
router.post("/HuyDangKyKhoaHoc", quanLyKhoaHocController.huyDangKyKhoaHoc);

module.exports = router;
