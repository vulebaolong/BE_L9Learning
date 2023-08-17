const { uploadImg, deleteImg } = require("../helpers/ImgHelper");
const responsesHelper = require("../helpers/responsesHelper");
const DanhMucKhoaHocModel = require("../models/danhMucKhoaHoc");
const KhoaHocModel = require("../models/khoaHocModel");
const youtubeHelper = require("../helpers/youtubeHelper");
const isFileValidHelper = require("../helpers/isFileValidHelper");

const layDanhSachKhoaHoc = async (tenKhoaHoc) => {
    if (!tenKhoaHoc) {
        const khoaHocs = await KhoaHocModel.find().populate("danhMucKhoaHoc_ID").select("-createdAt -updatedAt -__v");

        return responsesHelper(200, "Xử lý thành công", khoaHocs);
    }

    const khoaHoc = await KhoaHocModel.findOne({ tenKhoaHoc: { $regex: tenKhoaHoc, $options: "i" } })
        .populate("danhMucKhoaHoc_ID")
        .select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const layMotKhoaHoc = async (id) => {
    if (!id) return responsesHelper(400, "Thiếu id khoá học");

    const khoaHoc = await KhoaHocModel.findById(id).populate("danhMucKhoaHoc_ID").select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const layDanhMucKhoaHoc = async () => {
    const danhMucKhoaHoc = await DanhMucKhoaHocModel.find().select("-createdAt -updatedAt -__v");
    return responsesHelper(200, "Xử lý thành công", danhMucKhoaHoc);
};

const themDanhMucKhoaHoc = async (tenDanhMuc) => {
    const danhMucKhoaHoc = await DanhMucKhoaHocModel.create(tenDanhMuc);
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

    return responsesHelper(200, "Xử lý thành công", khoaHocUpdate);
};

const xoaKhoaHoc = async (idKhoaHoc) => {
    if (!idKhoaHoc) return responsesHelper(400, "Thiếu idKhoaHoc khoá học");

    const deletedKhoaHoc = await KhoaHocModel.findByIdAndDelete(idKhoaHoc).select("-createdAt -updatedAt -__v");

    // xoá ảnh cũ
    await deleteImg(deletedKhoaHoc.tenHinhAnh);

    return responsesHelper(200, "Xử lý thành công", deletedKhoaHoc);
};

module.exports = {
    layDanhSachKhoaHoc,
    themDanhMucKhoaHoc,
    themKhoaHoc,
    layMotKhoaHoc,
    xoaKhoaHoc,
    capNhatKhoaHoc,
    layDanhMucKhoaHoc,
};
