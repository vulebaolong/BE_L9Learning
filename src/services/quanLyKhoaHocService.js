const { uploadImg, deleteImg } = require("../helpers/ImgHelper");
const responsesHelper = require("../helpers/responsesHelper");
const CourseCategoryModel = require("../models/courseCategory");
const CourseModel = require("../models/courseModel");
const youtubeHelper = require("../helpers/youtubeHelper");
const isFileValidHelper = require("../helpers/isFileValidHelper");
const EnrollCourseModel = require("../models/enrollCourse");
const _ = require("lodash");
const wait = require("../helpers/waitHelper");
const filterKhoaHocTheoDanhMuc = require("../helpers/khoaHocHelper");
const UserModel = require("../models/userModel");
const changeObj = require("../helpers/changeObjHelper");

const layDanhSachKhoaHoc = async (courseName) => {
    if (!courseName) {
        const khoaHocs = await CourseModel.find().populate("courseCategory_ID").select("-createdAt -updatedAt -__v");

        // await wait(3000)

        return responsesHelper(200, "Xử lý thành công", khoaHocs);
    }

    const fuzzySearchQuery = _.escapeRegExp(courseName);

    const courses = await CourseModel.find({ courseName: { $regex: fuzzySearchQuery, $options: "i" } }).select("courseName image");

    return responsesHelper(200, "Xử lý thành công", courses);
};

const layMotKhoaHoc = async (id) => {
    if (!id) return responsesHelper(400, "Thiếu id khoá học");

    const courses = await CourseModel.findById(id).populate("courseCategory_ID").select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", courses);
};

const getCourseByCategory = async (courseCategoryCode) => {
    if (!courseCategoryCode) {
        const courseCategory = await CourseCategoryModel.find().select("-createdAt -updatedAt -__v");

        const danhSachKhoaHoc = await CourseModel.find().populate("courseCategory_ID", "categoryName").select("image courseName");

        const khoaHocTheoDanhMuc = filterKhoaHocTheoDanhMuc(courseCategory, danhSachKhoaHoc);

        return responsesHelper(200, "Xử lý thành công", khoaHocTheoDanhMuc);
    }
    const courseCategory = await CourseCategoryModel.findById(courseCategoryCode).select("-createdAt -updatedAt -__v");

    const danhSachKhoaHoc = await CourseModel.find({ courseCategory_ID: courseCategoryCode }).populate("courseCategory_ID", "categoryName").select("image courseName");

    const khoaHocTheoDanhMuc = filterKhoaHocTheoDanhMuc([courseCategory], danhSachKhoaHoc);

    // await wait(3000)

    return responsesHelper(200, "Xử lý thành công", khoaHocTheoDanhMuc);
};

const getListCourseCategories = async () => {
    const courseCategory = await CourseCategoryModel.find().select("-createdAt -updatedAt -__v");
    return responsesHelper(200, "Xử lý thành công", courseCategory);
};

const themDanhMucKhoaHoc = async (categoryName) => {
    if (!categoryName) return responsesHelper(400, "Thiếu categoryName");

    const courseCategory = await CourseCategoryModel.create({ categoryName });

    return responsesHelper(200, "Xử lý thành công", courseCategory);
};

const addCourse = async (file, courseName, description, price, courseCategory_ID, willLearn, lessons) => {
    if (!courseName) return responsesHelper(400, "Thiếu tên khoá học");
    if (!description) return responsesHelper(400, "Thiếu mô tả");
    if (!price) return responsesHelper(400, "Thiếu giá tiền");
    if (!courseCategory_ID) return responsesHelper(400, "Thiếu danh mục khoá học");
    if (!willLearn) return responsesHelper(400, "Thiếu sẽ học được gì");
    if (!lessons) return responsesHelper(400, "Thiếu chương học");
    if (!file) return responsesHelper(400, "Thiếu hình ảnh");
    price = +price;
    lessons = JSON.parse(lessons);
    willLearn = JSON.parse(willLearn);

    const fetchChuongHocData = async (lessons) => {
        return Promise.all(
            lessons.map(async (chuong) => {
                const videos = await Promise.all(
                    chuong.videos.map(async (video) => {
                        const duration = await youtubeHelper.fetchVideoDuration(video.video_url);
                        return {
                            title: video.title,
                            video_url: video.video_url,
                            duration,
                        };
                    })
                );
                return {
                    title: chuong.title,
                    videos,
                };
            })
        );
    };

    lessons = await fetchChuongHocData(lessons);

    const exitMove = await CourseModel.findOne({ courseName });
    if (exitMove) return responsesHelper(400, "Khoá học đã tồn tại");

    const objHinhAnh = await uploadImg(file, "khoaHoc");

    const courses = await CourseModel.create({
        courseName,
        description,
        price,
        courseCategory_ID,
        willLearn,
        lessons,
        image: objHinhAnh.image,
        imageName: objHinhAnh.imageName,
    });

    // await wait(3000)

    return responsesHelper(200, "Xử lý thành công", courses);
};

const updateCourse = async (file, courseCode, courseName, description, price, courseCategory_ID, willLearn, lessons) => {
    if (!courseName) return responsesHelper(400, "Thiếu tên khoá học");
    if (!description) return responsesHelper(400, "Thiếu mô tả");
    if (!price) return responsesHelper(400, "Thiếu giá tiền");
    if (!courseCategory_ID) return responsesHelper(400, "Thiếu danh mục khoá học");
    if (!willLearn) return responsesHelper(400, "Thiếu sẽ học được gì");
    if (!lessons) return responsesHelper(400, "Thiếu chương học");
    if (!courseCode) return responsesHelper(400, "Thiếu mã khoá học");
    const courses = await CourseModel.findById(courseCode);
    if (!courses) return responsesHelper(400, "Xử lý không thành công", `Tên khoá học: ${courseName} không tồn tại`);

    price = +price;
    lessons = JSON.parse(lessons);
    willLearn = JSON.parse(willLearn);

    const fetchChuongHocData = async (lessons) => {
        return Promise.all(
            lessons.map(async (chuong) => {
                const videos = await Promise.all(
                    chuong.videos.map(async (video) => {
                        const duration = await youtubeHelper.fetchVideoDuration(video.video_url);
                        return {
                            title: video.title,
                            video_url: video.video_url,
                            duration,
                        };
                    })
                );
                return {
                    title: chuong.title,
                    videos,
                };
            })
        );
    };

    lessons = await fetchChuongHocData(lessons);

    let objHinhAnh = {
        image: courses.image,
        imageName: courses.imageName,
    };

    // nếu file hình ảnh tồn tại thì mới update hình ảnh
    if (isFileValidHelper(file)) {
        console.log(courses.imageName);
        // xoá ảnh cũ
        const isDeleteImg = await deleteImg(courses.imageName);

        if (!isDeleteImg) return responsesHelper(400, "Xử lý hình ảnh không thành công");

        // thêm ảnh mới
        if (isDeleteImg) objHinhAnh = await uploadImg(file, "khoaHoc");
    }

    // update phim
    const khoaHocUpdate = await CourseModel.findByIdAndUpdate(
        courseCode,
        {
            courseName,
            description,
            price,
            courseCategory_ID,
            willLearn,
            lessons,
            image: objHinhAnh.image,
            imageName: objHinhAnh.imageName,
        },
        { new: true }
    );

    // await wait(5000)

    return responsesHelper(200, "Xử lý thành công", khoaHocUpdate);
};

const deleteCourse = async (courseCode) => {
    if (!courseCode) return responsesHelper(400, "Thiếu courseCode khoá học");

    // Kiểm tra courseCode có tồn tại khoá học không
    const khoaHocDb = await CourseModel.findById(courseCode);
    if (!khoaHocDb) return responsesHelper(400, "Xử lý không thành công", `Khoá học không tồn tại`);

    // tìm và xoá khoá học
    const deletedKhoaHoc = await CourseModel.findByIdAndDelete(khoaHocDb._id).select("-createdAt -updatedAt -__v");

    // xóa tất cả các documents có khoaHoc_ID
    await EnrollCourseModel.deleteMany({ khoaHoc_ID: deletedKhoaHoc._id });

    // xoá ảnh cũ
    await deleteImg(deletedKhoaHoc.imageName);

    return responsesHelper(200, "Xử lý thành công", deletedKhoaHoc);
};

const enrollCourse = async (courseCode, user) => {
    if (!courseCode) return responsesHelper(400, "Thiếu courseCode mã khoá học");

    const exitDangKyKhoaHoc = await EnrollCourseModel.findOne({ khoaHoc_ID: courseCode, user_ID: user.id });
    if (exitDangKyKhoaHoc) return responsesHelper(400, "Khoá học này đã được đăng ký");

    const enrollCourse = await EnrollCourseModel.create({ khoaHoc_ID: courseCode, user_ID: user.id });

    // await wait(3000);

    return responsesHelper(200, "Xử lý thành công", enrollCourse);
};

const cancelEnrollment = async (courseCode, user) => {
    if (!courseCode) return responsesHelper(400, "Thiếu courseCode mã khoá học");

    const deleteDangKyKhoaHoc = await EnrollCourseModel.findOneAndDelete({ khoaHoc_ID: courseCode, user_ID: user.id });
    // if (exitDangKyKhoaHoc) return responsesHelper(400, "Khoá học này đã được đăng ký");

    // const enrollCourse = await EnrollCourseModel.create({ khoaHoc_ID: courseCode, user_ID: user.id });
    // await wait(3000);

    return responsesHelper(200, "Xử lý thành công", deleteDangKyKhoaHoc);
};

const getUserInformationForCourse = async (courseId) => {
    if (!courseId) return responsesHelper(400, "Thiếu userId tài khoản");

    const course = await CourseModel.findById(courseId).select("image courseName");
    if (!course) return responsesHelper(400, "Xử lý không thành công", `Khoá học không tồn tại`);

    // LỌC NGƯỜI DÙNG ĐÃ ĐĂNG KÝ =================================================================
    let enrolledUsers = changeObj(
        await EnrollCourseModel.find({ khoaHoc_ID: course._id })
            .select("-__v -updatedAt -createdAt -user_ID")
            .populate("user_ID", "username fullName phoneNumber email avatar userType")
    );
    enrolledUsers = enrolledUsers.map((user) => {
        return { ...user.user_ID };
    });

    // LỌC NGƯỜI DÙNG CHƯA ĐĂNG KÝ ===============================================================
    const arrIdEnrolledUsers = enrolledUsers.map((user) => user._id);

    // từ mảng các id chứa khoá học đã đăng ký: arrIdKhoaHocDaDangKy
    // tìm kiếm trong UserModel những documents không có trong arrIdKhoaHocDaDangKy
    const unenrolledUsers = await UserModel.find({ _id: { $nin: arrIdEnrolledUsers } }).select("username fullName phoneNumber email avatar userType");

    const result = {
        course,
        enrolledUsers,
        unenrolledUsers,
    };
    return responsesHelper(200, "Xử lý thành công", result);
};

const cancelUserEnrollmentForCourse = async (userId, courseId) => {
    if (!userId) return responsesHelper(400, "Thiếu userId");
    if (!courseId) return responsesHelper(400, "Thiếu courseId");

    const result = await EnrollCourseModel.deleteMany({ khoaHoc_ID: courseId, user_ID: userId });

    return responsesHelper(200, "Xử lý thành công", result);
};

const enrollUserForCourse = async (userId, courseId) => {
    if (!userId) return responsesHelper(400, "Thiếu userId");
    if (!courseId) return responsesHelper(400, "Thiếu courseId");

    const result = await EnrollCourseModel.create({ khoaHoc_ID: courseId, user_ID: userId });

    return responsesHelper(200, "Xử lý thành công", result);
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
