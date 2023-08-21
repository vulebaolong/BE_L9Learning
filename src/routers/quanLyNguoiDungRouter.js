const express = require("express");
const multer = require("multer");
const quanLyNguoiDungController = require("../controllers/quanLyNguoiDungController");
const protect = require("../middlewares/protect");

const router = express.Router();
const upload = multer();

router.post("/DangKy", quanLyNguoiDungController.dangKy);
router.post("/DangNhap", quanLyNguoiDungController.dangNhap);

//! những dòng mã chạy sau sẽ đều có protect, vì chạy theo thứ tự
router.use(protect);
// TaiKhoan => tài khoản đang đăng nhập
router.get("/ThongTinTaiKhoan", quanLyNguoiDungController.thongTinTaiKhoan);
router.put("/CapNhatThongTinTaiKhoan", quanLyNguoiDungController.capNhatThongTinTaiKhoan);
router.patch("/CapNhatMotThongTinTaiKhoan", quanLyNguoiDungController.capNhatMotThongTinTaiKhoan);
router.patch("/CapNhatMatKhau", quanLyNguoiDungController.capNhatMatKhau);
router.patch("/CapNhatAvatarTaiKhoan", upload.single("avatar"), quanLyNguoiDungController.capNhatAvatarTaiKhoan);

// NguoiDung => admin thao tác với các người dùng
router.get("/LayDanhSachNguoiDung", quanLyNguoiDungController.layDanhSachNguoiDung);
router.get("/LayThongTinNguoiDung", quanLyNguoiDungController.layThongTinNguoiDung);
router.patch("/CapNhatMotThongTinNguoiDung", quanLyNguoiDungController.capNhatMotThongTinNguoiDung);
router.delete("/XoaNguoiDung", quanLyNguoiDungController.xoaNguoiDung);
router.patch("/CapNhatAvatarNguoiDung", upload.single("avatar"), quanLyNguoiDungController.capNhatAvatarNguoiDung);
router.get("/LayThongTinKhoaHocNguoiDung", quanLyNguoiDungController.layThongTinKhoaHocNguoiDung);
router.post("/DangKyKhoaHocChoNguoiDung", quanLyNguoiDungController.dangKyKhoaHocChoNguoiDung);
router.post("/HuyDangKyKhoaHocChoNguoiDung", quanLyNguoiDungController.huyDangKyKhoaHocChoNguoiDung);


module.exports = router;
