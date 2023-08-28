const courseManagementService = require("../services/courseManagementService");

const layDanhSachKhoaHoc = async (req, res, next) => {
    try {
        const courseName = req.query.courseName;

        const result = await courseManagementService.layDanhSachKhoaHoc(courseName);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const layMotKhoaHoc = async (req, res, next) => {
    try {
        const id = req.query.id;

        const result = await courseManagementService.layMotKhoaHoc(id);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getCourseByCategory = async (req, res, next) => {
    try {
        const courseCategoryCode = req.query.courseCategoryCode;

        const result = await courseManagementService.getCourseByCategory(courseCategoryCode);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getListCourseCategories = async (req, res, next) => {
    try {
        const result = await courseManagementService.getListCourseCategories();

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const themDanhMucKhoaHoc = async (req, res, next) => {
    try {
        const categoryName = req.body.categoryName;

        const result = await courseManagementService.themDanhMucKhoaHoc(categoryName);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const addCourse = async (req, res, next) => {
    try {
        const { courseName, description, price, courseCategory_ID, willLearn, lessons } = req.body;

        const result = await courseManagementService.addCourse(req.file, courseName, description, price, courseCategory_ID, willLearn, lessons);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const { courseCode, courseName, description, price, courseCategory_ID, willLearn, lessons } = req.body;

        const result = await courseManagementService.updateCourse(req.file, courseCode, courseName, description, price, courseCategory_ID, willLearn, lessons);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        const courseCode = req.query.courseCode;

        const result = await courseManagementService.deleteCourse(courseCode);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const enrollCourse = async (req, res, next) => {
    try {
        const courseCode = req.body.courseCode;
        const user = req.user;

        const result = await courseManagementService.enrollCourse(courseCode, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const cancelEnrollment = async (req, res, next) => {
    try {
        const courseCode = req.body.courseCode;
        const user = req.user;

        const result = await courseManagementService.cancelEnrollment(courseCode, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getUserInformationForCourse = async (req, res, next) => {
    try {
        const courseId = req.query.courseId;

        const result = await courseManagementService.getUserInformationForCourse(courseId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const cancelUserEnrollmentForCourse = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;

        const result = await courseManagementService.cancelUserEnrollmentForCourse(userId, courseId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const enrollUserForCourse = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;

        const result = await courseManagementService.enrollUserForCourse(userId, courseId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    layDanhSachKhoaHoc,
    themDanhMucKhoaHoc,
    addCourse,
    layMotKhoaHoc,
    deleteCourse,
    updateCourse,
    getListCourseCategories,
    enrollCourse,
    cancelEnrollment,
    getCourseByCategory,
    getUserInformationForCourse,
    cancelUserEnrollmentForCourse,
    enrollUserForCourse,
};
