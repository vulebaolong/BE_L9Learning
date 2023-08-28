const responsesHelper = require("../helpers/responsesHelper");
const UserModel = require("../models/userModel");
const EnrollCourseModel = require("../models/enrollCourse");
const { hashedPassword } = require("../helpers/authHelper");
const { createJwt } = require("../helpers/authHelper");
const { checkPassword } = require("../helpers/authHelper");
const { uploadImg, deleteImg } = require("../helpers/ImgHelper");
const isFileValidHelper = require("../helpers/isFileValidHelper");
const { AVATAR_DEFAULT } = require("../contants/imgContant");
const wait = require("../helpers/waitHelper");
const CourseModel = require("../models/courseModel");
const changeObj = require("../helpers/changeObjHelper");

const register = async (username, password, email, phoneNumber, fullName) => {
    if (!username) return responsesHelper(400, "Thiếu tài khoản");
    if (!password) return responsesHelper(400, "Thiếu mật khẩu");
    if (!email) return responsesHelper(400, "Thiếu email");
    if (!phoneNumber) return responsesHelper(400, "Thiếu số điện thoại");
    if (!fullName) return responsesHelper(400, "Thiếu họ và tên");

    const passwordNew = await hashedPassword(password);

    const user = await UserModel.create({
        username,
        password: passwordNew,
        email,
        phoneNumber,
        fullName,
    });

    return responsesHelper(200, "Xử lý thành công", {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        userType: user.userType,
    });
};

const login = async (username, password) => {
    if (!username) return responsesHelper(400, "Thiếu tài khoản");
    if (!password) return responsesHelper(400, "Thiếu mật khẩu");

    const user = await UserModel.findOne({ username }).select("+password");
    if (!user) return responsesHelper(401, "Tài khoản không tồn tại");

    const isPassword = await checkPassword(password, user.password);
    if (!isPassword) return responsesHelper(401, "Mật khẩu không đúng");

    // tạo token
    const accessToken = createJwt({ id: `${user._id}`, username: user.username, email: user.email, phoneNumber: user.phoneNumber, fullName: user.fullName }, "90d");
    if (!accessToken) return responsesHelper(500, "Lỗi server: Không tạo được token");

    const enrolledCourseDetail = await EnrollCourseModel.find({ user_ID: user._id })
        .select("-__v -updatedAt -createdAt -user_ID")
        .populate("course_ID", "image description courseName");

    const enrolledCourseDetailResult = enrolledCourseDetail.map((item) => {
        return item.course_ID;
    });

    return responsesHelper(200, "Đăng nhập thành công", {
        enrolledCourseDetail: enrolledCourseDetailResult,
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        accessToken,
        userType: user.userType,
        avatar: user.avatar,
        bannerProfile: user.bannerProfile,
    });
};

const getAccountInfo = async (user) => {
    const userReturn = await UserModel.findById(user.id);

    const enrolledCourseDetail = await EnrollCourseModel.find({ user_ID: user.id })
        .select("-__v -updatedAt -createdAt -user_ID")
        .populate("course_ID", "image description courseName");

    const enrolledCourseDetailResult = enrolledCourseDetail.map((item) => {
        return item.course_ID;
    });

    return responsesHelper(200, "Xử lý thành công", {
        enrolledCourseDetail: enrolledCourseDetailResult,
        id: userReturn._id,
        username: userReturn.username,
        email: userReturn.email,
        phoneNumber: userReturn.phoneNumber,
        fullName: userReturn.fullName,
        userType: userReturn.userType,
        bannerProfile: userReturn.bannerProfile,
        avatar: userReturn.avatar,
    });
};

const updateAccountInfo = async (email, fullName, userType, phoneNumber, username, user) => {
    if (!email) return responsesHelper(400, "Thiếu email");
    if (!fullName) return responsesHelper(400, "Thiếu họ tên");
    if (!userType) return responsesHelper(400, "Thiếu mã loại nơiời dùng");
    if (!phoneNumber) return responsesHelper(400, "Thiếu số điện thoại");
    if (!username) return responsesHelper(400, "Thiếu tài khoản");

    const userUpdate = await UserModel.findByIdAndUpdate(user.id, { email, fullName, userType, phoneNumber, username }, { new: true });

    return responsesHelper(200, "Xử lý thành công", userUpdate);
};

const updateOneAccountInfo = async (body, user) => {
    const keys = Object.keys(body);

    const key = keys[0];

    if (!key) return responsesHelper(400, "Thiếu thông tin cần sửa");
    if (key === "password") return responsesHelper(400, "Vui lòng dùng api updatePassword");
    if (key === "avatar") return responsesHelper(400, "Vui lòng dùng api capNhatAvatar");
    if (key === "bannerProfile") return responsesHelper(400, "Vui lòng dùng api capNhatBannerProfile");

    const updatedUser = await UserModel.findByIdAndUpdate(user.id, { [key]: body[key] }, { new: true });

    return responsesHelper(200, "Xử lý thành công", updatedUser);
};

const updatePassword = async (currentPassword, newPassword, user) => {
    if (!currentPassword) return responsesHelper(400, "Thiếu mật khẩu hiện tại");
    if (!newPassword) return responsesHelper(400, "Thiếu mật khẩu mới");

    const userDb = await UserModel.findById(user.id).select("+password");
    const passwordDb = userDb.password;

    // kiểm tra mật khẩu current
    const isMatKhauCurrent = await checkPassword(currentPassword, passwordDb);
    if (!isMatKhauCurrent) return responsesHelper(400, "Xử lý không thành công", "Mật khẩu hiện tại không chính xác");

    // mã hoá mật khẩu mới
    const passwordNewDb = await hashedPassword(newPassword);

    // lưu mật khẩu mới vào db
    await UserModel.findByIdAndUpdate(user.id, { password: passwordNewDb });

    return responsesHelper(200, "Xử lý thành công", "Thay đổi mật khẩu thành công");
};

const updateAccountAvatar = async (file, user) => {
    // console.log(file);
    // console.log(user);

    if (!file) return responsesHelper(200, "Giữ lại hình ảnh cũ, không nhận được hình ảnh mới");

    const userDb = await UserModel.findById(user.id);

    if (!userDb) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    // Trường hợp thay đổi avart không xoá AVATAR_DEFAULT
    if (userDb.avatar === AVATAR_DEFAULT) {
        console.log("Trường hợp thay đổi avart không xoá AVATAR_DEFAULT");
        const imgNew = await uploadImg(file, "avatas");
        const userUpdate = await UserModel.findByIdAndUpdate(
            userDb._id,
            {
                avatar: imgNew.image,
                avatarName: imgNew.imageName,
            },
            { new: true }
        );
        return responsesHelper(200, "Xử lý thành công", userUpdate);
    }

    // Trường hợp thay đổi avart xoá avatar cũ
    if (userDb.avatar !== AVATAR_DEFAULT) {
        console.log("Trường hợp thay đổi avart xoá avatar cũ");
        // xoá ảnh cũ
        const isDeleteImg = await deleteImg(userDb.avatarName);

        if (!isDeleteImg) return responsesHelper(400, "Xử lý deleteImg hình ảnh không thành công");

        // thêm ảnh mới
        if (isDeleteImg) imgNew = await uploadImg(file, "avatas");

        const userUpdate = await UserModel.findByIdAndUpdate(
            userDb._id,
            {
                avatar: imgNew.image,
                avatarName: imgNew.imageName,
            },
            { new: true }
        );
        return responsesHelper(200, "Xử lý thành công", userUpdate);
    }

    return responsesHelper(400, "Có vấn đề, không rơi vào 1 trong 2 trường hợp có và không có AVATAR_DEFAULT");
};

const updateUserAvatar = async (file, userId) => {
    if (!file) return responsesHelper(200, "Giữ lại hình ảnh cũ, không nhận được hình ảnh mới");

    const userDb = await UserModel.findById(userId);

    if (!userDb) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    // Trường hợp thay đổi avart không xoá AVATAR_DEFAULT
    if (userDb.avatar === AVATAR_DEFAULT) {
        console.log("Trường hợp thay đổi avart không xoá AVATAR_DEFAULT");
        const imgNew = await uploadImg(file, "avatas");
        const userUpdate = await UserModel.findByIdAndUpdate(
            userDb._id,
            {
                avatar: imgNew.image,
                avatarName: imgNew.imageName,
            },
            { new: true }
        );
        return responsesHelper(200, "Xử lý thành công", userUpdate);
    }

    // Trường hợp thay đổi avart xoá avatar cũ
    if (userDb.avatar !== AVATAR_DEFAULT) {
        console.log("Trường hợp thay đổi avart xoá avatar cũ");
        // xoá ảnh cũ
        const isDeleteImg = await deleteImg(userDb.avatarName);

        if (!isDeleteImg) return responsesHelper(400, "Xử lý deleteImg hình ảnh không thành công");

        // thêm ảnh mới
        if (isDeleteImg) imgNew = await uploadImg(file, "avatas");

        const userUpdate = await UserModel.findByIdAndUpdate(
            userDb._id,
            {
                avatar: imgNew.image,
                avatarName: imgNew.imageName,
            },
            { new: true }
        );
        return responsesHelper(200, "Xử lý thành công", userUpdate);
    }

    return responsesHelper(400, "Có vấn đề, không rơi vào 1 trong 2 trường hợp có và không có AVATAR_DEFAULT");
    // return responsesHelper(200, "Xử lý thành công", file);
};

const getListUsers = async (fullName) => {
    if (!fullName) {
        const listUser = await UserModel.find().select("-createdAt -updatedAt -__v");

        // await wait(3000)

        return responsesHelper(200, "Xử lý thành công", listUser);
    }

    const fuzzySearchQuery = _.escapeRegExp(fullName);

    const listUser = await UserModel.find({ fullName: { $regex: fuzzySearchQuery, $options: "i" } }).select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", listUser);
};

const getUserInfo = async (userId) => {
    if (!userId) return responsesHelper(400, "Thiếu userId tài khoản");

    const userInfo = await UserModel.findById(userId).select("-createdAt -updatedAt -__v");

    if (!userInfo) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    return responsesHelper(200, "Xử lý thành công", userInfo);
};

const updateOneUserInfo = async (info) => {
    const { userId, ...newObject } = info;
    if (!userId) return responsesHelper(400, "Thiếu userId");

    // Kiểm tra userId có tồn tại người dùng không
    const userDb = await UserModel.findById(userId);
    if (!userDb) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    const keys = Object.keys(newObject);

    const key = keys[0];

    if (!key) return responsesHelper(400, "Thiếu thông tin cần sửa");
    if (key === "password") return responsesHelper(400, "Vui lòng dùng api updatePassword");
    if (key === "avatar") return responsesHelper(400, "Vui lòng dùng api capNhatAvatar");
    if (key === "bannerProfile") return responsesHelper(400, "Vui lòng dùng api capNhatBannerProfile");

    const updatedUser = await UserModel.findByIdAndUpdate(userDb._id, { [key]: newObject[key] }, { new: true });

    return responsesHelper(200, "Xử lý thành công", updatedUser);
};

const deleteUser = async (userId) => {
    if (!userId) return responsesHelper(400, "Thiếu userId tài khoản");

    // Kiểm tra userId có tồn tại người dùng không
    const userDb = await UserModel.findById(userId);
    if (!userDb) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    // Xoá người dùng
    const deletedUser = await UserModel.findByIdAndDelete(userDb._id).select("-createdAt -updatedAt -__v");

    // xóa tất cả các documents có user_ID
    await EnrollCourseModel.deleteMany({ user_ID: deletedUser._id });

    // Trường hợp đã từng thay đổi avatar nên phải xoá avatar
    if (deletedUser.avatar !== AVATAR_DEFAULT) {
        const isDeleteImg = await deleteImg(deletedUser.avatarName);
        if (!isDeleteImg) return responsesHelper(400, "Xử lý deleteImg hình ảnh không thành công");
    }

    return responsesHelper(200, "Xử lý thành công", deletedUser);
};

const getCoursesInfoForUsser = async (userId) => {
    if (!userId) return responsesHelper(400, "Thiếu userId tài khoản");

    const userInfo = await UserModel.findById(userId).select("-createdAt -updatedAt -__v");
    if (!userInfo) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    // LỌC KHOÁ HỌC ĐÃ ĐĂNG KÝ =================================================================
    let enrolledCourse = changeObj(
        await EnrollCourseModel.find({ user_ID: userInfo._id }).select("-__v -updatedAt -createdAt -user_ID").populate("course_ID", "image courseName")
    );
    enrolledCourse = enrolledCourse.map((courses) => {
        return { ...courses.course_ID };
    });

    // LỌC KHOÁ HỌC CHƯA ĐĂNG KÝ ===============================================================
    const arrIdCourseEnrolled = enrolledCourse.map((courses) => courses._id);

    // từ mảng các id chứa khoá học đã đăng ký: arrIdCourseEnrolled
    // tìm kiếm trong CourseModel những documents không có trong arrIdCourseEnrolled
    const unenrolledCourse = await CourseModel.find({ _id: { $nin: arrIdCourseEnrolled } }).select("image courseName");

    const result = {
        userInfo,
        enrolledCourse,
        unenrolledCourse,
    };
    return responsesHelper(200, "Xử lý thành công", result);
};

const cancelCourseEnrollmentForUser = async (userId, courseId) => {
    if (!userId) return responsesHelper(400, "Thiếu userId");
    if (!courseId) return responsesHelper(400, "Thiếu courseId");

    const result = await EnrollCourseModel.deleteMany({ course_ID: courseId, user_ID: userId });

    return responsesHelper(200, "Xử lý thành công", result);
};

const enrollCourseForUser = async (userId, courseId) => {
    if (!userId) return responsesHelper(400, "Thiếu userId");
    if (!courseId) return responsesHelper(400, "Thiếu courseId");

    const result = await EnrollCourseModel.create({ course_ID: courseId, user_ID: userId });

    return responsesHelper(200, "Xử lý thành công",  result);
};

module.exports = {
    register,
    login,
    getAccountInfo,
    updateAccountInfo,
    updateOneAccountInfo,
    updatePassword,
    updateAccountAvatar,
    updateUserAvatar,
    getListUsers,
    getUserInfo,
    updateOneUserInfo,
    deleteUser,
    getCoursesInfoForUsser,
    cancelCourseEnrollmentForUser,
    enrollCourseForUser,
};
