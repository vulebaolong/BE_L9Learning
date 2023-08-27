const quanLyNguoiDungService = require("../services/quanLyNguoiDungService");

const register = async (req, res, next) => {
    try {
        const { taiKhoan, matKhau, email, soDt, hoTen } = req.body;

        const result = await quanLyNguoiDungService.register(taiKhoan, matKhau, email, soDt, hoTen);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { taiKhoan, matKhau } = req.body;

        const result = await quanLyNguoiDungService.login(taiKhoan, matKhau);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateAccountInfo = async (req, res, next) => {
    try {
        const user = req.user;
        const { email, hoTen, maLoaiNguoiDung, soDt, taiKhoan } = req.body;

        const result = await quanLyNguoiDungService.updateAccountInfo(email, hoTen, maLoaiNguoiDung, soDt, taiKhoan, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateOneAccountInfo = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await quanLyNguoiDungService.updateOneAccountInfo(req.body, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const user = req.user;

        const { currentPassword, newPassword } = req.body;

        const result = await quanLyNguoiDungService.updatePassword(currentPassword, newPassword, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getAccountInfo = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await quanLyNguoiDungService.getAccountInfo(user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateAccountAvatar = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await quanLyNguoiDungService.updateAccountAvatar(req.file, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateUserAvatar = async (req, res, next) => {
    try {
        const userId = req.body.userId;

        const result = await quanLyNguoiDungService.updateUserAvatar(req.file, userId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getListUsers = async (req, res, next) => {
    try {
        const tenNguoiDung = req.query.tenNguoiDung;

        const result = await quanLyNguoiDungService.getListUsers(tenNguoiDung);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getUserInfo = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        const result = await quanLyNguoiDungService.getUserInfo(userId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateOneUserInfo = async (req, res, next) => {
    try {
        const thongTin = req.body;

        const result = await quanLyNguoiDungService.updateOneUserInfo(thongTin);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        const result = await quanLyNguoiDungService.deleteUser(userId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getCoursesInfoForUsser = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        const result = await quanLyNguoiDungService.getCoursesInfoForUsser(userId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const cancelCourseEnrollmentForUser = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;

        const result = await quanLyNguoiDungService.cancelCourseEnrollmentForUser(userId, courseId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const enrollCourseForUser = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;

        const result = await quanLyNguoiDungService.enrollCourseForUser(userId, courseId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getAccountInfo,
    updateAccountInfo,
    updateOneAccountInfo,
    updatePassword,
    updateAccountAvatar,
    getListUsers,
    getUserInfo,
    updateOneUserInfo,
    deleteUser,
    updateUserAvatar,
    getCoursesInfoForUsser,
    cancelCourseEnrollmentForUser,
    enrollCourseForUser,
};
