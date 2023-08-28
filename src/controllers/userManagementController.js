const userManagementService = require("../services/userManagementService");

const register = async (req, res, next) => {
    try {
        const { username, password, email, phoneNumber, fullName } = req.body;

        const result = await userManagementService.register(username, password, email, phoneNumber, fullName);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const result = await userManagementService.login(username, password);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateAccountInfo = async (req, res, next) => {
    try {
        const user = req.user;
        const { email, fullName, userType, phoneNumber, username } = req.body;

        const result = await userManagementService.updateAccountInfo(email, fullName, userType, phoneNumber, username, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateOneAccountInfo = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await userManagementService.updateOneAccountInfo(req.body, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const user = req.user;

        const { currentPassword, newPassword } = req.body;

        const result = await userManagementService.updatePassword(currentPassword, newPassword, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getAccountInfo = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await userManagementService.getAccountInfo(user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateAccountAvatar = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await userManagementService.updateAccountAvatar(req.file, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateUserAvatar = async (req, res, next) => {
    try {
        const userId = req.body.userId;

        const result = await userManagementService.updateUserAvatar(req.file, userId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getListUsers = async (req, res, next) => {
    try {
        const tenNguoiDung = req.query.tenNguoiDung;

        const result = await userManagementService.getListUsers(tenNguoiDung);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getUserInfo = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        const result = await userManagementService.getUserInfo(userId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const updateOneUserInfo = async (req, res, next) => {
    try {
        const thongTin = req.body;

        const result = await userManagementService.updateOneUserInfo(thongTin);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        const result = await userManagementService.deleteUser(userId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const getCoursesInfoForUsser = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        const result = await userManagementService.getCoursesInfoForUsser(userId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const cancelCourseEnrollmentForUser = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;

        const result = await userManagementService.cancelCourseEnrollmentForUser(userId, courseId);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const enrollCourseForUser = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;

        const result = await userManagementService.enrollCourseForUser(userId, courseId);

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
