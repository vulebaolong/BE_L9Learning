const express = require("express");
const multer = require("multer");
const courseManagementController = require("../controllers/courseManagementController");
const protect = require("../middlewares/protect");

const router = express.Router();
const upload = multer();

router.get("/GetListCourses", courseManagementController.layDanhSachKhoaHoc);
router.get("/GetCourseById", courseManagementController.layMotKhoaHoc);
router.get("/GetCourseByCategory", courseManagementController.getCourseByCategory);
router.get("/GetListCourseCategories", courseManagementController.getListCourseCategories);

//! những dòng mã chạy sau sẽ đều có protect, vì chạy theo thứ tự
router.use(protect);
router.post("/ThemDanhMucKhoaHoc", courseManagementController.themDanhMucKhoaHoc);
router.post("/AddCourse", upload.single("image"), courseManagementController.addCourse);
router.delete("/DeleteCourse", courseManagementController.deleteCourse);
router.put("/UpdateCourse", upload.single("image"), courseManagementController.updateCourse);
router.post("/EnrollCourse", courseManagementController.enrollCourse);
router.post("/CancelEnrollment", courseManagementController.cancelEnrollment);
router.get("/GetUserInformationForCourse", courseManagementController.getUserInformationForCourse);
router.post("/EnrollUserForCourse", courseManagementController.enrollUserForCourse);
router.post("/CancelUserEnrollmentForCourse", courseManagementController.cancelUserEnrollmentForCourse);




module.exports = router;
