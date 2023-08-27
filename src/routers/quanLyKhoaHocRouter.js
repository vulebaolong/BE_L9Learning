const express = require("express");
const multer = require("multer");
const quanLyKhoaHocController = require("../controllers/quanLyKhoaHocController");
const protect = require("../middlewares/protect");

const router = express.Router();
const upload = multer();

router.get("/GetListCourses", quanLyKhoaHocController.layDanhSachKhoaHoc);
router.get("/GetCourseById", quanLyKhoaHocController.layMotKhoaHoc);
router.get("/GetCourseByCategory", quanLyKhoaHocController.getCourseByCategory);
router.get("/GetListCourseCategories", quanLyKhoaHocController.getListCourseCategories);

//! những dòng mã chạy sau sẽ đều có protect, vì chạy theo thứ tự
router.use(protect);
router.post("/ThemDanhMucKhoaHoc", quanLyKhoaHocController.themDanhMucKhoaHoc);
router.post("/AddCourse", upload.single("hinhAnh"), quanLyKhoaHocController.addCourse);
router.delete("/DeleteCourse", quanLyKhoaHocController.deleteCourse);
router.put("/UpdateCourse", upload.single("hinhAnh"), quanLyKhoaHocController.updateCourse);
router.post("/EnrollCourse", quanLyKhoaHocController.enrollCourse);
router.post("/CancelEnrollment", quanLyKhoaHocController.cancelEnrollment);
router.get("/GetUserInformationForCourse", quanLyKhoaHocController.getUserInformationForCourse);
router.post("/EnrollUserForCourse", quanLyKhoaHocController.enrollUserForCourse);
router.post("/CancelUserEnrollmentForCourse", quanLyKhoaHocController.cancelUserEnrollmentForCourse);




module.exports = router;
