const { uploadImg, deleteImg } = require("../helpers/ImgHelper");
const responsesHelper = require("../helpers/responsesHelper");
const DanhMucKhoaHocModel = require("../models/danhMucKhoaHoc");
const KhoaHocModel = require("../models/khoaHocModel");
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
        const khoaHocs = await KhoaHocModel.find().populate("danhMucKhoaHoc_ID").select("-createdAt -updatedAt -__v");

        // await wait(3000)

        return responsesHelper(200, "Xử lý thành công", khoaHocs);
    }

    const fuzzySearchQuery = _.escapeRegExp(courseName);

    const khoaHoc = await KhoaHocModel.find({ courseName: { $regex: fuzzySearchQuery, $options: "i" } }).select("courseName hinhAnh");

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const layMotKhoaHoc = async (id) => {
    if (!id) return responsesHelper(400, "Thiếu id khoá học");

    const khoaHoc = await KhoaHocModel.findById(id).populate("danhMucKhoaHoc_ID").select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const getCourseByCategory = async (courseCategoryCode) => {
    if (!courseCategoryCode) {
        const danhMucKhoaHoc = await DanhMucKhoaHocModel.find().select("-createdAt -updatedAt -__v");

        const danhSachKhoaHoc = await KhoaHocModel.find().populate("danhMucKhoaHoc_ID", "tenDanhMuc").select("hinhAnh courseName");

        const khoaHocTheoDanhMuc = filterKhoaHocTheoDanhMuc(danhMucKhoaHoc, danhSachKhoaHoc);

        return responsesHelper(200, "Xử lý thành công", khoaHocTheoDanhMuc);
    }
    const danhMucKhoaHoc = await DanhMucKhoaHocModel.findById(courseCategoryCode).select("-createdAt -updatedAt -__v");

    const danhSachKhoaHoc = await KhoaHocModel.find({ danhMucKhoaHoc_ID: courseCategoryCode }).populate("danhMucKhoaHoc_ID", "tenDanhMuc").select("hinhAnh courseName");

    const khoaHocTheoDanhMuc = filterKhoaHocTheoDanhMuc([danhMucKhoaHoc], danhSachKhoaHoc);

    // await wait(3000)

    return responsesHelper(200, "Xử lý thành công", khoaHocTheoDanhMuc);
};

const getListCourseCategories = async () => {
    const danhMucKhoaHoc = await DanhMucKhoaHocModel.find().select("-createdAt -updatedAt -__v");
    return responsesHelper(200, "Xử lý thành công", danhMucKhoaHoc);
};

const themDanhMucKhoaHoc = async (tenDanhMuc) => {
    if (!tenDanhMuc) return responsesHelper(400, "Thiếu tenDanhMuc");

    const danhMucKhoaHoc = await DanhMucKhoaHocModel.create({ tenDanhMuc });

    return responsesHelper(200, "Xử lý thành công", danhMucKhoaHoc);
};

const addCourse = async (file, courseName, moTa, giaTien, danhMucKhoaHoc_ID, seHocDuoc, chuongHoc) => {
    if (!courseName) return responsesHelper(400, "Thiếu tên khoá học");
    if (!moTa) return responsesHelper(400, "Thiếu mô tả");
    if (!giaTien) return responsesHelper(400, "Thiếu giá tiền");
    if (!danhMucKhoaHoc_ID) return responsesHelper(400, "Thiếu danh mục khoá học");
    if (!seHocDuoc) return responsesHelper(400, "Thiếu sẽ học được gì");
    if (!chuongHoc) return responsesHelper(400, "Thiếu chương học");
    if (!file) return responsesHelper(400, "Thiếu hình ảnh");
    giaTien = +giaTien;
    chuongHoc = JSON.parse(chuongHoc);
    seHocDuoc = JSON.parse(seHocDuoc);

    const fetchChuongHocData = async (chuongHoc) => {
        return Promise.all(
            chuongHoc.map(async (chuong) => {
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

    chuongHoc = await fetchChuongHocData(chuongHoc);

    const exitMove = await KhoaHocModel.findOne({ courseName });
    if (exitMove) return responsesHelper(400, "Khoá học đã tồn tại");

    const objHinhAnh = await uploadImg(file, "khoaHoc");

    const khoaHoc = await KhoaHocModel.create({
        courseName,
        moTa,
        giaTien,
        danhMucKhoaHoc_ID,
        seHocDuoc,
        chuongHoc,
        hinhAnh: objHinhAnh.hinhAnh,
        tenHinhAnh: objHinhAnh.tenHinhAnh,
    });

    // await wait(3000)

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const updateCourse = async (file, courseCode, courseName, moTa, giaTien, danhMucKhoaHoc_ID, seHocDuoc, chuongHoc) => {
    if (!courseName) return responsesHelper(400, "Thiếu tên khoá học");
    if (!moTa) return responsesHelper(400, "Thiếu mô tả");
    if (!giaTien) return responsesHelper(400, "Thiếu giá tiền");
    if (!danhMucKhoaHoc_ID) return responsesHelper(400, "Thiếu danh mục khoá học");
    if (!seHocDuoc) return responsesHelper(400, "Thiếu sẽ học được gì");
    if (!chuongHoc) return responsesHelper(400, "Thiếu chương học");
    if (!courseCode) return responsesHelper(400, "Thiếu mã khoá học");
    const khoaHoc = await KhoaHocModel.findById(courseCode);
    if (!khoaHoc) return responsesHelper(400, "Xử lý không thành công", `Tên khoá học: ${courseName} không tồn tại`);

    giaTien = +giaTien;
    chuongHoc = JSON.parse(chuongHoc);
    seHocDuoc = JSON.parse(seHocDuoc);

    const fetchChuongHocData = async (chuongHoc) => {
        return Promise.all(
            chuongHoc.map(async (chuong) => {
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

    chuongHoc = await fetchChuongHocData(chuongHoc);

    let objHinhAnh = {
        hinhAnh: khoaHoc.hinhAnh,
        tenHinhAnh: khoaHoc.tenHinhAnh,
    };

    // nếu file hình ảnh tồn tại thì mới update hình ảnh
    if (isFileValidHelper(file)) {
        console.log(khoaHoc.tenHinhAnh);
        // xoá ảnh cũ
        const isDeleteImg = await deleteImg(khoaHoc.tenHinhAnh);

        if (!isDeleteImg) return responsesHelper(400, "Xử lý hình ảnh không thành công");

        // thêm ảnh mới
        if (isDeleteImg) objHinhAnh = await uploadImg(file, "khoaHoc");
    }

    // update phim
    const khoaHocUpdate = await KhoaHocModel.findByIdAndUpdate(
        courseCode,
        {
            courseName,
            moTa,
            giaTien,
            danhMucKhoaHoc_ID,
            seHocDuoc,
            chuongHoc,
            hinhAnh: objHinhAnh.hinhAnh,
            tenHinhAnh: objHinhAnh.tenHinhAnh,
        },
        { new: true }
    );

    // await wait(5000)

    return responsesHelper(200, "Xử lý thành công", khoaHocUpdate);
};

const deleteCourse = async (courseCode) => {
    if (!courseCode) return responsesHelper(400, "Thiếu courseCode khoá học");

    // Kiểm tra courseCode có tồn tại khoá học không
    const khoaHocDb = await KhoaHocModel.findById(courseCode);
    if (!khoaHocDb) return responsesHelper(400, "Xử lý không thành công", `Khoá học không tồn tại`);

    // tìm và xoá khoá học
    const deletedKhoaHoc = await KhoaHocModel.findByIdAndDelete(khoaHocDb._id).select("-createdAt -updatedAt -__v");

    // xóa tất cả các documents có khoaHoc_ID
    await EnrollCourseModel.deleteMany({ khoaHoc_ID: deletedKhoaHoc._id });

    // xoá ảnh cũ
    await deleteImg(deletedKhoaHoc.tenHinhAnh);

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

    const khoaHoc = await KhoaHocModel.findById(courseId).select("hinhAnh courseName");
    if (!khoaHoc) return responsesHelper(400, "Xử lý không thành công", `Khoá học không tồn tại`);

    // LỌC NGƯỜI DÙNG ĐÃ ĐĂNG KÝ =================================================================
    let nguoiDungDaDangKy = changeObj(
        await EnrollCourseModel.find({ khoaHoc_ID: khoaHoc._id })
            .select("-__v -updatedAt -createdAt -user_ID")
            .populate("user_ID", "taiKhoan hoTen soDt email avatar maLoaiNguoiDung")
    );
    nguoiDungDaDangKy = nguoiDungDaDangKy.map((nguoiDung) => {
        return { ...nguoiDung.user_ID };
    });

    // LỌC NGƯỜI DÙNG CHƯA ĐĂNG KÝ ===============================================================
    const arrIdNguoiDungDaDangKy = nguoiDungDaDangKy.map((nguoiDung) => nguoiDung._id);

    // từ mảng các id chứa khoá học đã đăng ký: arrIdKhoaHocDaDangKy
    // tìm kiếm trong UserModel những documents không có trong arrIdKhoaHocDaDangKy
    const nguoiDungChuaDangKy = await UserModel.find({ _id: { $nin: arrIdNguoiDungDaDangKy } }).select("taiKhoan hoTen soDt email avatar maLoaiNguoiDung");

    const result = {
        khoaHoc,
        nguoiDungDaDangKy,
        nguoiDungChuaDangKy,
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
