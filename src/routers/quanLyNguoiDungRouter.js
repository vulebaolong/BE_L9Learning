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
router.get("/ThongTinTaiKhoan", quanLyNguoiDungController.thongTinTaiKhoan);
router.put("/CapNhatThongTinNguoiDung", quanLyNguoiDungController.capNhatThongTinNguoiDung);
router.patch("/CapNhatMotThongTinNguoiDung", quanLyNguoiDungController.capNhatMotThongTinNguoiDung);
router.patch("/CapNhatMatKhau", quanLyNguoiDungController.capNhatMatKhau);
router.patch("/CapNhatAvatar", upload.single("avatar"), quanLyNguoiDungController.capNhatAvatar);
router.get("/LayDanhSachNguoiDung", quanLyNguoiDungController.layDanhSachNguoiDung);
router.delete("/XoaNguoiDung", quanLyNguoiDungController.xoaNguoiDung);


module.exports = router;
