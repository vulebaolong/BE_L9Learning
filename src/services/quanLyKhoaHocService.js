const { uploadImg } = require("../helpers/ImgHelper");
const responsesHelper = require("../helpers/responsesHelper");
const DanhMucKhoaHocModel = require("../models/danhMucKhoaHoc");
const KhoaHocModel = require("../models/khoaHocModel");
const youtubeHelper = require("../helpers/youtubeHelper");

const layDanhSachKhoaHoc = async (tenKhoaHoc) => {
    if (!tenKhoaHoc) {
        const khoaHocs = await KhoaHocModel.find().select("-createdAt -updatedAt -__v");

        return responsesHelper(200, "Xử lý thành công", khoaHocs);
    }

    const khoaHoc = await KhoaHocModel.findOne({ tenKhoaHoc: { $regex: tenKhoaHoc, $options: "i" } }).select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const layMotKhoaHoc = async (id) => {
    if (!id) return responsesHelper(400, "Thiếu id khoá học");

    const khoaHoc = await KhoaHocModel.findById(id).select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const themDanhMucKhoaHoc = async (tenDanhMuc) => {
    const danhMucKhoaHoc = await DanhMucKhoaHocModel.create(tenDanhMuc);
    return responsesHelper(200, "Xử lý thành công", danhMucKhoaHoc);
};

const themKhoaHoc = async (file, tenKhoaHoc, moTa, giaTien, seHocDuoc, chuongHoc) => {
    if (!tenKhoaHoc) return responsesHelper(400, "Thiếu tên khoá học");
    if (!moTa) return responsesHelper(400, "Thiếu mô tả");
    if (!giaTien) return responsesHelper(400, "Thiếu giá tiền");
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
        seHocDuoc,
        chuongHoc,
        hinhAnh: objHinhAnh.hinhAnh,
        tenHinhAnh: objHinhAnh.tenHinhAnh,
    });

    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

module.exports = {
    layDanhSachKhoaHoc,
    themDanhMucKhoaHoc,
    themKhoaHoc,
    layMotKhoaHoc,
};
