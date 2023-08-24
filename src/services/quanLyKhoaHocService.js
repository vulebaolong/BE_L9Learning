const { uploadImg, deleteImg } = require("../helpers/ImgHelper");
const responsesHelper = require("../helpers/responsesHelper");
const DanhMucKhoaHocModel = require("../models/danhMucKhoaHoc");
const KhoaHocModel = require("../models/khoaHocModel");
const youtubeHelper = require("../helpers/youtubeHelper");
const isFileValidHelper = require("../helpers/isFileValidHelper");
const DangKyKhoaHocModel = require("../models/dangKyKhoaHoc");
const _ = require("lodash");
const wait = require("../helpers/waitHelper");
const filterKhoaHocTheoDanhMuc = require("../helpers/khoaHocHelper");
const UserModel = require("../models/userModel");
const changeObj = require("../helpers/changeObjHelper");

const layDanhSachKhoaHoc = async (tenKhoaHoc) => {
    if (!tenKhoaHoc) {
        const khoaHocs = await KhoaHocModel.find().populate("danhMucKhoaHoc_ID").select("-createdAt -updatedAt -__v");

        // await wait(3000)

        return responsesHelper(200, "Xử lý thành công", khoaHocs);
    }

    const fuzzySearchQuery = _.escapeRegExp(tenKhoaHoc);

    const khoaHoc = await KhoaHocModel.find({ tenKhoaHoc: { $regex: fuzzySearchQuery, $options: "i" } }).select("tenKhoaHoc hinhAnh");

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const layMotKhoaHoc = async (id) => {
    if (!id) return responsesHelper(400, "Thiếu id khoá học");

    const khoaHoc = await KhoaHocModel.findById(id).populate("danhMucKhoaHoc_ID").select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const layKhoaHocTheoDanhMuc = async (maDanhMuc) => {
    if (!maDanhMuc) {
        const danhMucKhoaHoc = await DanhMucKhoaHocModel.find().select("-createdAt -updatedAt -__v");

        const danhSachKhoaHoc = await KhoaHocModel.find().populate("danhMucKhoaHoc_ID", "tenDanhMuc").select("hinhAnh tenKhoaHoc");

        const khoaHocTheoDanhMuc = filterKhoaHocTheoDanhMuc(danhMucKhoaHoc, danhSachKhoaHoc);

        return responsesHelper(200, "Xử lý thành công", khoaHocTheoDanhMuc);
    }
    const danhMucKhoaHoc = await DanhMucKhoaHocModel.findById(maDanhMuc).select("-createdAt -updatedAt -__v");

    const danhSachKhoaHoc = await KhoaHocModel.find({ danhMucKhoaHoc_ID: maDanhMuc }).populate("danhMucKhoaHoc_ID", "tenDanhMuc").select("hinhAnh tenKhoaHoc");

    const khoaHocTheoDanhMuc = filterKhoaHocTheoDanhMuc([danhMucKhoaHoc], danhSachKhoaHoc);

    // await wait(3000)

    return responsesHelper(200, "Xử lý thành công", khoaHocTheoDanhMuc);
};

const layDanhMucKhoaHoc = async () => {
    const danhMucKhoaHoc = await DanhMucKhoaHocModel.find().select("-createdAt -updatedAt -__v");
    return responsesHelper(200, "Xử lý thành công", danhMucKhoaHoc);
};

const themDanhMucKhoaHoc = async (tenDanhMuc) => {
    if (!tenDanhMuc) return responsesHelper(400, "Thiếu tenDanhMuc");

    const danhMucKhoaHoc = await DanhMucKhoaHocModel.create({ tenDanhMuc });

    return responsesHelper(200, "Xử lý thành công", danhMucKhoaHoc);
};

const themKhoaHoc = async (file, tenKhoaHoc, moTa, giaTien, danhMucKhoaHoc_ID, seHocDuoc, chuongHoc) => {
    if (!tenKhoaHoc) return responsesHelper(400, "Thiếu tên khoá học");
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

    const exitMove = await KhoaHocModel.findOne({ tenKhoaHoc });
    if (exitMove) return responsesHelper(400, "Khoá học đã tồn tại");

    const objHinhAnh = await uploadImg(file, "khoaHoc");

    const khoaHoc = await KhoaHocModel.create({
        tenKhoaHoc,
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

const capNhatKhoaHoc = async (file, maKhoaHoc, tenKhoaHoc, moTa, giaTien, danhMucKhoaHoc_ID, seHocDuoc, chuongHoc) => {
    if (!tenKhoaHoc) return responsesHelper(400, "Thiếu tên khoá học");
    if (!moTa) return responsesHelper(400, "Thiếu mô tả");
    if (!giaTien) return responsesHelper(400, "Thiếu giá tiền");
    if (!danhMucKhoaHoc_ID) return responsesHelper(400, "Thiếu danh mục khoá học");
    if (!seHocDuoc) return responsesHelper(400, "Thiếu sẽ học được gì");
    if (!chuongHoc) return responsesHelper(400, "Thiếu chương học");
    if (!maKhoaHoc) return responsesHelper(400, "Thiếu mã khoá học");
    const khoaHoc = await KhoaHocModel.findById(maKhoaHoc);
    if (!khoaHoc) return responsesHelper(400, "Xử lý không thành công", `Tên khoá học: ${tenKhoaHoc} không tồn tại`);

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
        maKhoaHoc,
        {
            tenKhoaHoc,
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

const xoaKhoaHoc = async (maKhoaHoc) => {
    if (!maKhoaHoc) return responsesHelper(400, "Thiếu maKhoaHoc khoá học");

    // Kiểm tra maKhoaHoc có tồn tại khoá học không
    const khoaHocDb = await KhoaHocModel.findById(maKhoaHoc);
    if (!khoaHocDb) return responsesHelper(400, "Xử lý không thành công", `Khoá học không tồn tại`);

    // tìm và xoá khoá học
    const deletedKhoaHoc = await KhoaHocModel.findByIdAndDelete(khoaHocDb._id).select("-createdAt -updatedAt -__v");

    // xóa tất cả các documents có khoaHoc_ID
    await DangKyKhoaHocModel.deleteMany({ khoaHoc_ID: deletedKhoaHoc._id });

    // xoá ảnh cũ
    await deleteImg(deletedKhoaHoc.tenHinhAnh);

    return responsesHelper(200, "Xử lý thành công", deletedKhoaHoc);
};

const dangKyKhoaHoc = async (maKhoaHoc, user) => {
    if (!maKhoaHoc) return responsesHelper(400, "Thiếu maKhoaHoc mã khoá học");

    const exitDangKyKhoaHoc = await DangKyKhoaHocModel.findOne({ khoaHoc_ID: maKhoaHoc, user_ID: user.id });
    if (exitDangKyKhoaHoc) return responsesHelper(400, "Khoá học này đã được đăng ký");

    const dangKyKhoaHoc = await DangKyKhoaHocModel.create({ khoaHoc_ID: maKhoaHoc, user_ID: user.id });

    // await wait(3000);

    return responsesHelper(200, "Xử lý thành công", dangKyKhoaHoc);
};

const huyDangKyKhoaHoc = async (maKhoaHoc, user) => {
    if (!maKhoaHoc) return responsesHelper(400, "Thiếu maKhoaHoc mã khoá học");

    const deleteDangKyKhoaHoc = await DangKyKhoaHocModel.findOneAndDelete({ khoaHoc_ID: maKhoaHoc, user_ID: user.id });
    // if (exitDangKyKhoaHoc) return responsesHelper(400, "Khoá học này đã được đăng ký");

    // const dangKyKhoaHoc = await DangKyKhoaHocModel.create({ khoaHoc_ID: maKhoaHoc, user_ID: user.id });
    // await wait(3000);

    return responsesHelper(200, "Xử lý thành công", deleteDangKyKhoaHoc);
};

const layThongTinNguoiDungChoKhoaHoc = async (idKhoaHoc) => {
    if (!idKhoaHoc) return responsesHelper(400, "Thiếu idNguoiDung tài khoản");

    const khoaHoc = await KhoaHocModel.findById(idKhoaHoc).select("hinhAnh tenKhoaHoc");
    if (!khoaHoc) return responsesHelper(400, "Xử lý không thành công", `Khoá học không tồn tại`);

    // LỌC NGƯỜI DÙNG ĐÃ ĐĂNG KÝ =================================================================
    let nguoiDungDaDangKy = changeObj(
        await DangKyKhoaHocModel.find({ khoaHoc_ID: khoaHoc._id })
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

const huyDangKyNguoiDungChoKhoaHoc = async (idNguoiDung, idKhoaHoc) => {
    if (!idNguoiDung) return responsesHelper(400, "Thiếu idNguoiDung");
    if (!idKhoaHoc) return responsesHelper(400, "Thiếu idKhoaHoc");

    const result = await DangKyKhoaHocModel.deleteMany({ khoaHoc_ID: idKhoaHoc, user_ID: idNguoiDung });

    return responsesHelper(200, "Xử lý thành công", result);
};

const dangKyNguoiDungChoKhoaHoc = async (idNguoiDung, idKhoaHoc) => {
    if (!idNguoiDung) return responsesHelper(400, "Thiếu idNguoiDung");
    if (!idKhoaHoc) return responsesHelper(400, "Thiếu idKhoaHoc");

    const result = await DangKyKhoaHocModel.create({ khoaHoc_ID: idKhoaHoc, user_ID: idNguoiDung });

    return responsesHelper(200, "Xử lý thành công", result);
};

module.exports = {
    layDanhSachKhoaHoc,
    themDanhMucKhoaHoc,
    themKhoaHoc,
    layMotKhoaHoc,
    xoaKhoaHoc,
    capNhatKhoaHoc,
    layDanhMucKhoaHoc,
    dangKyKhoaHoc,
    huyDangKyKhoaHoc,
    layKhoaHocTheoDanhMuc,
    layThongTinNguoiDungChoKhoaHoc,
    huyDangKyNguoiDungChoKhoaHoc,
    dangKyNguoiDungChoKhoaHoc,
};
