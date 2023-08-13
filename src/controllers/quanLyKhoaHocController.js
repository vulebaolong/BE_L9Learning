const quanLyKhoaHocService = require("../services/quanLyKhoaHocService");

const layDanhSachKhoaHoc = async (req, res, next) => {
    try {
        const tenKhoaHoc = req.query.tenKhoaHoc;

        const result = await quanLyKhoaHocService.layDanhSachKhoaHoc(tenKhoaHoc);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};
const themDanhMucKhoaHoc = async (req, res, next) => {
    try {
        const tenDanhMuc = req.body;

        const result = await quanLyKhoaHocService.themDanhMucKhoaHoc(tenDanhMuc);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};
const themKhoaHoc = async (req, res, next) => {
    try {
        const { tenKhoaHoc, moTa, ngayTao } = req.body;

        const result = await quanLyKhoaHocService.themKhoaHoc(req.file, tenKhoaHoc, moTa, ngayTao);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    layDanhSachKhoaHoc,
    themDanhMucKhoaHoc,
    themKhoaHoc,
};
