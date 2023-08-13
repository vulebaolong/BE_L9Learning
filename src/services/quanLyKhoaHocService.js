const { uploadImg } = require("../helpers/ImgHelper");
const responsesHelper = require("../helpers/responsesHelper");
const DanhMucKhoaHocModel = require("../models/danhMucKhoaHoc");
const KhoaHocModel = require("../models/khoaHocModel");

const layDanhSachKhoaHoc = async (tenKhoaHoc) => {
    if (!tenKhoaHoc) {
        const khoaHocs = await KhoaHocModel.find().select("-createdAt -updatedAt -__v");
        return responsesHelper(200, "Xử lý thành công", khoaHocs);
    }
    const khoaHoc = await KhoaHocModel.findOne({ tenKhoaHoc: { $regex: tenKhoaHoc, $options: "i" } }).select("-createdAt -updatedAt -__v");
    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

const themDanhMucKhoaHoc = async (tenDanhMuc) => {
    const danhMucKhoaHoc = await DanhMucKhoaHocModel.create(tenDanhMuc);
    return responsesHelper(200, "Xử lý thành công", danhMucKhoaHoc);
};

const themKhoaHoc = async (file, tenKhoaHoc, moTa, ngayTao) => {
    if (!tenKhoaHoc) return responsesHelper(400, "Thiếu tên khoá học");
    if (!moTa) return responsesHelper(400, "Thiếu mô tả");
    if (!ngayTao) return responsesHelper(400, "Thiếu ngày tạo");
    if (!file) return responsesHelper(400, "Thiếu hình ảnh");

    const exitMove = await KhoaHocModel.findOne({ tenKhoaHoc });
    if (exitMove) return responsesHelper(400, "Khoá học đã tồn tại");

    const objHinhAnh = await uploadImg(file, "khoaHoc");

    const khoaHoc = await KhoaHocModel.create({
        tenKhoaHoc,
        moTa,
        ngayTao,
        hinhAnh: objHinhAnh.hinhAnh,
        tenHinhAnh: objHinhAnh.tenHinhAnh,
    });
    return responsesHelper(200, "Xử lý thành công", khoaHoc);
};

module.exports = {
    layDanhSachKhoaHoc,
    themDanhMucKhoaHoc,
    themKhoaHoc,
};
