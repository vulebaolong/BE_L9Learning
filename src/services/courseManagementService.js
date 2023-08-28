const { uploadImg, deleteImg } = require("../helpers/ImgHelper");
const responsesHelper = require("../helpers/responsesHelper");
const CourseCategoryModel = require("../models/courseCategory");
const CourseModel = require("../models/courseModel");
const youtubeHelper = require("../helpers/youtubeHelper");
const isFileValidHelper = require("../helpers/isFileValidHelper");
const EnrollCourseModel = require("../models/enrollCourse");
const _ = require("lodash");
const wait = require("../helpers/waitHelper");
const filterCoursesByCategory = require("../helpers/khoaHocHelper");
const UserModel = require("../models/userModel");
const changeObj = require("../helpers/changeObjHelper");

const getListCourses = async (courseName) => {
    if (!courseName) {
        const courses = await CourseModel.find().populate("courseCategory_ID").select("-createdAt -updatedAt -__v");

        // await wait(3000)

        return responsesHelper(200, "Xử lý thành công", courses);
    }

    const fuzzySearchQuery = _.escapeRegExp(courseName);

    const courses = await CourseModel.find({ courseName: { $regex: fuzzySearchQuery, $options: "i" } }).select("courseName image");

    return responsesHelper(200, "Xử lý thành công", courses);
};

const getOneCourse = async (id) => {
    if (!id) return responsesHelper(400, "Thiếu id khoá học");

    const courses = await CourseModel.findById(id).populate("courseCategory_ID").select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", courses);
};

const getCourseByCategory = async (courseCategoryCode) => {
    if (!courseCategoryCode) {
        const courseCategory = await CourseCategoryModel.find().select("-createdAt -updatedAt -__v");

        const listCourse = await CourseModel.find().populate("courseCategory_ID", "categoryName").select("image courseName");

        const courseByCategory = filterCoursesByCategory(courseCategory, listCourse);

        return responsesHelper(200, "Xử lý thành công", courseByCategory);
    }
    const courseCategory = await CourseCategoryModel.findById(courseCategoryCode).select("-createdAt -updatedAt -__v");

    const listCourse = await CourseModel.find({ courseCategory_ID: courseCategoryCode }).populate("courseCategory_ID", "categoryName").select("image courseName");

    const courseByCategory = filterCoursesByCategory([courseCategory], listCourse);

    // await wait(3000)

    return responsesHelper(200, "Xử lý thành công", courseByCategory);
};

const getListCourseCategories = async () => {
    const courseCategory = await CourseCategoryModel.find().select("-createdAt -updatedAt -__v");
    return responsesHelper(200, "Xử lý thành công", courseCategory);
};

const addCategory = async (categoryName) => {
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
            lessons.map(async (chapter) => {
                const videos = await Promise.all(
                    chapter.videos.map(async (video) => {
                        const duration = await youtubeHelper.fetchVideoDuration(video.video_url);
                        return {
                            title: video.title,
                            video_url: video.video_url,
                            duration,
                        };
                    })
                );
                return {
                    title: chapter.title,
                    videos,
                };
            })
        );
    };

    lessons = await fetchChuongHocData(lessons);

    const exitMove = await CourseModel.findOne({ courseName });
    if (exitMove) return responsesHelper(400, "Khoá học đã tồn tại");

    const objImg = await uploadImg(file, "khoaHoc");

    const courses = await CourseModel.create({
        courseName,
        description,
        price,
        courseCategory_ID,
        willLearn,
        lessons,
        image: objImg.image,
        imageName: objImg.imageName,
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
            lessons.map(async (chapter) => {
                const videos = await Promise.all(
                    chapter.videos.map(async (video) => {
                        const duration = await youtubeHelper.fetchVideoDuration(video.video_url);
                        return {
                            title: video.title,
                            video_url: video.video_url,
                            duration,
                        };
                    })
                );
                return {
                    title: chapter.title,
                    videos,
                };
            })
        );
    };

    lessons = await fetchChuongHocData(lessons);

    let objImg = {
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
        if (isDeleteImg) objImg = await uploadImg(file, "khoaHoc");
    }

    // update phim
    const courseUpdate = await CourseModel.findByIdAndUpdate(
        courseCode,
        {
            courseName,
            description,
            price,
            courseCategory_ID,
            willLearn,
            lessons,
            image: objImg.image,
            imageName: objImg.imageName,
        },
        { new: true }
    );

    // await wait(5000)

    return responsesHelper(200, "Xử lý thành công", courseUpdate);
};

const deleteCourse = async (courseCode) => {
    if (!courseCode) return responsesHelper(400, "Thiếu courseCode khoá học");

    // Kiểm tra courseCode có tồn tại khoá học không
    const courseDb = await CourseModel.findById(courseCode);
    if (!courseDb) return responsesHelper(400, "Xử lý không thành công", `Khoá học không tồn tại`);

    // tìm và xoá khoá học
    const deletedCourse = await CourseModel.findByIdAndDelete(courseDb._id).select("-createdAt -updatedAt -__v");

    // xóa tất cả các documents có course_ID
    await EnrollCourseModel.deleteMany({ course_ID: deletedCourse._id });

    // xoá ảnh cũ
    await deleteImg(deletedCourse.imageName);

    return responsesHelper(200, "Xử lý thành công", deletedCourse);
};

const enrollCourse = async (courseCode, user) => {
    if (!courseCode) return responsesHelper(400, "Thiếu courseCode mã khoá học");

    const exitEnrollCourse = await EnrollCourseModel.findOne({ course_ID: courseCode, user_ID: user.id });
    if (exitEnrollCourse) return responsesHelper(400, "Khoá học này đã được đăng ký");

    const enrollCourse = await EnrollCourseModel.create({ course_ID: courseCode, user_ID: user.id });

    // await wait(3000);

    return responsesHelper(200, "Xử lý thành công", enrollCourse);
};

const cancelEnrollment = async (courseCode, user) => {
    if (!courseCode) return responsesHelper(400, "Thiếu courseCode mã khoá học");

    const deleteEnrollCourse = await EnrollCourseModel.findOneAndDelete({ course_ID: courseCode, user_ID: user.id });

    return responsesHelper(200, "Xử lý thành công", deleteEnrollCourse);
};

const getUserInformationForCourse = async (courseId) => {
    if (!courseId) return responsesHelper(400, "Thiếu userId tài khoản");

    const course = await CourseModel.findById(courseId).select("image courseName");
    if (!course) return responsesHelper(400, "Xử lý không thành công", `Khoá học không tồn tại`);

    // LỌC NGƯỜI DÙNG ĐÃ ĐĂNG KÝ =================================================================
    let enrolledUsers = changeObj(
        await EnrollCourseModel.find({ course_ID: course._id })
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

    const result = await EnrollCourseModel.deleteMany({ course_ID: courseId, user_ID: userId });

    return responsesHelper(200, "Xử lý thành công", result);
};

const enrollUserForCourse = async (userId, courseId) => {
    if (!userId) return responsesHelper(400, "Thiếu userId");
    if (!courseId) return responsesHelper(400, "Thiếu courseId");

    const result = await EnrollCourseModel.create({ course_ID: courseId, user_ID: userId });

    return responsesHelper(200, "Xử lý thành công", result);
};

module.exports = {
    getListCourses,
    addCategory,
    addCourse,
    getOneCourse,
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
