const express = require("express");
const multer = require("multer");
const quanLyNguoiDungController = require("../controllers/quanLyNguoiDungController");
const protect = require("../middlewares/protect");

const router = express.Router();
const upload = multer();

router.post("/Register", quanLyNguoiDungController.register);
router.post("/Login", quanLyNguoiDungController.login);

//! những dòng mã chạy sau sẽ đều có protect, vì chạy theo thứ tự
router.use(protect);
// TaiKhoan => tài khoản đang đăng nhập
router.get("/GetAccountInfo", quanLyNguoiDungController.getAccountInfo);
router.put("/UpdateAccountInfo", quanLyNguoiDungController.updateAccountInfo);
router.patch("/UpdateOneAccountInfo", quanLyNguoiDungController.updateOneAccountInfo);
router.patch("/UpdatePassword", quanLyNguoiDungController.updatePassword);
router.patch("/UpdateAccountAvatar", upload.single("avatar"), quanLyNguoiDungController.updateAccountAvatar);

// NguoiDung => admin thao tác với các người dùng
router.get("/GetListUsers", quanLyNguoiDungController.getListUsers);
router.get("/GetUserInfo", quanLyNguoiDungController.getUserInfo);
router.patch("/UpdateOneUserInfo", quanLyNguoiDungController.updateOneUserInfo);
router.delete("/DeleteUser", quanLyNguoiDungController.deleteUser);
router.patch("/UpdateUserAvatar", upload.single("avatar"), quanLyNguoiDungController.updateUserAvatar);
router.get("/GetCoursesInfoForUsser", quanLyNguoiDungController.getCoursesInfoForUsser);
router.post("/EnrollCourseForUser", quanLyNguoiDungController.enrollCourseForUser);
router.post("/CancelCourseEnrollmentForUser", quanLyNguoiDungController.cancelCourseEnrollmentForUser);


module.exports = router;
