const express = require("express");
const quanLyNguoiDungController = require("../controllers/quanLyNguoiDungController");
const protect = require("../middlewares/protect");

const router = express.Router();

router.post("/DangKy", quanLyNguoiDungController.dangKy);
router.post("/DangNhap", quanLyNguoiDungController.dangNhap);

//! những dòng mã chạy sau sẽ đều có protect, vì chạy theo thứ tự
router.use(protect);
router.get("/ThongTinTaiKhoan", quanLyNguoiDungController.thongTinTaiKhoan);
router.put("/CapNhatThongTinNguoiDung", quanLyNguoiDungController.capNhatThongTinNguoiDung);
router.patch("/CapNhatMotThongTinNguoiDung", quanLyNguoiDungController.capNhatMotThongTinNguoiDung);
router.patch("/CapNhatMatKhau", quanLyNguoiDungController.capNhatMatKhau);

module.exports = router;
