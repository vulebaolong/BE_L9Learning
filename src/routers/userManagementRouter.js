const express = require("express");
const multer = require("multer");
const userManagementController = require("../controllers/userManagementController");
const protect = require("../middlewares/protect");

const router = express.Router();
const upload = multer();

router.post("/Register", userManagementController.register);
router.post("/Login", userManagementController.login);

//! những dòng mã chạy sau sẽ đều có protect, vì chạy theo thứ tự
router.use(protect);
// TaiKhoan => tài khoản đang đăng nhập
router.get("/GetAccountInfo", userManagementController.getAccountInfo);
router.put("/UpdateAccountInfo", userManagementController.updateAccountInfo);
router.patch("/UpdateOneAccountInfo", userManagementController.updateOneAccountInfo);
router.patch("/UpdatePassword", userManagementController.updatePassword);
router.patch("/UpdateAccountAvatar", upload.single("avatar"), userManagementController.updateAccountAvatar);

// NguoiDung => admin thao tác với các người dùng
router.get("/GetListUsers", userManagementController.getListUsers);
router.get("/GetUserInfo", userManagementController.getUserInfo);
router.patch("/UpdateOneUserInfo", userManagementController.updateOneUserInfo);
router.delete("/DeleteUser", userManagementController.deleteUser);
router.patch("/UpdateUserAvatar", upload.single("avatar"), userManagementController.updateUserAvatar);
router.get("/GetCoursesInfoForUsser", userManagementController.getCoursesInfoForUsser);
router.post("/EnrollCourseForUser", userManagementController.enrollCourseForUser);
router.post("/CancelCourseEnrollmentForUser", userManagementController.cancelCourseEnrollmentForUser);


module.exports = router;
