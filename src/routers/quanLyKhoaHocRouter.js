const express = require("express");
const multer = require("multer");
const quanLyKhoaHocController = require("../controllers/quanLyKhoaHocController");
const protect = require("../middlewares/protect");

const router = express.Router();
const upload = multer();

router.get("/LayDanhSachKhoaHoc", quanLyKhoaHocController.layDanhSachKhoaHoc);
router.get("/LayMotKhoaHoc", quanLyKhoaHocController.layMotKhoaHoc);
router.get("/LayKhoaHocTheoDanhMuc", quanLyKhoaHocController.layKhoaHocTheoDanhMuc);
router.get("/LayDanhMucKhoaHoc", quanLyKhoaHocController.layDanhMucKhoaHoc);

//! những dòng mã chạy sau sẽ đều có protect, vì chạy theo thứ tự
router.use(protect);
router.post("/ThemDanhMucKhoaHoc", quanLyKhoaHocController.themDanhMucKhoaHoc);
router.post("/ThemKhoaHoc", upload.single("hinhAnh"), quanLyKhoaHocController.themKhoaHoc);
router.delete("/XoaKhoaHoc", quanLyKhoaHocController.xoaKhoaHoc);
router.put("/CapNhatKhoaHoc", upload.single("hinhAnh"), quanLyKhoaHocController.capNhatKhoaHoc);
router.post("/DangKyKhoaHoc", quanLyKhoaHocController.dangKyKhoaHoc);
router.post("/HuyDangKyKhoaHoc", quanLyKhoaHocController.huyDangKyKhoaHoc);
router.get("/LayThongTinNguoiDungChoKhoaHoc", quanLyKhoaHocController.layThongTinNguoiDungChoKhoaHoc);
router.post("/DangKyNguoiDungChoKhoaHoc", quanLyKhoaHocController.dangKyNguoiDungChoKhoaHoc);
router.post("/HuyDangKyNguoiDungChoKhoaHoc", quanLyKhoaHocController.huyDangKyNguoiDungChoKhoaHoc);




module.exports = router;
