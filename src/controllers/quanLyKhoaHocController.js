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

const layMotKhoaHoc = async (req, res, next) => {
    try {
        const id = req.query.id;

        const result = await quanLyKhoaHocService.layMotKhoaHoc(id);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const layDanhMucKhoaHoc = async (req, res, next) => {
    try {
        const result = await quanLyKhoaHocService.layDanhMucKhoaHoc();

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
        const { tenKhoaHoc, moTa, giaTien, danhMucKhoaHoc_ID, seHocDuoc, chuongHoc } = req.body;

        const result = await quanLyKhoaHocService.themKhoaHoc(req.file, tenKhoaHoc, moTa, giaTien, danhMucKhoaHoc_ID, seHocDuoc, chuongHoc);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const capNhatKhoaHoc = async (req, res, next) => {
    try {
        const { maKhoaHoc, tenKhoaHoc, moTa, giaTien, danhMucKhoaHoc_ID, seHocDuoc, chuongHoc } = req.body;

        const result = await quanLyKhoaHocService.capNhatKhoaHoc(req.file, maKhoaHoc, tenKhoaHoc, moTa, giaTien, danhMucKhoaHoc_ID, seHocDuoc, chuongHoc);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const xoaKhoaHoc = async (req, res, next) => {
    try {
        const maKhoaHoc = req.query.maKhoaHoc;

        const result = await quanLyKhoaHocService.xoaKhoaHoc(maKhoaHoc);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const dangKyKhoaHoc = async (req, res, next) => {
    try {
        const maKhoaHoc = req.body.maKhoaHoc;
        const user = req.user;

        const result = await quanLyKhoaHocService.dangKyKhoaHoc(maKhoaHoc, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
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
};
