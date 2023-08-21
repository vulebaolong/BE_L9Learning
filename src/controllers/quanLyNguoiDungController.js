const quanLyNguoiDungService = require("../services/quanLyNguoiDungService");

const dangKy = async (req, res, next) => {
    try {
        const { taiKhoan, matKhau, email, soDt, hoTen } = req.body;

        const result = await quanLyNguoiDungService.dangKy(taiKhoan, matKhau, email, soDt, hoTen);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const dangNhap = async (req, res, next) => {
    try {
        const { taiKhoan, matKhau } = req.body;

        const result = await quanLyNguoiDungService.dangNhap(taiKhoan, matKhau);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const capNhatThongTinTaiKhoan = async (req, res, next) => {
    try {
        const user = req.user;
        const { email, hoTen, maLoaiNguoiDung, soDt, taiKhoan } = req.body;

        const result = await quanLyNguoiDungService.capNhatThongTinTaiKhoan(email, hoTen, maLoaiNguoiDung, soDt, taiKhoan, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const capNhatMotThongTinTaiKhoan = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await quanLyNguoiDungService.capNhatMotThongTinTaiKhoan(req.body, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const capNhatMatKhau = async (req, res, next) => {
    try {
        const user = req.user;

        const { matKhauCurent, matKhauNew } = req.body;

        const result = await quanLyNguoiDungService.capNhatMatKhau(matKhauCurent, matKhauNew, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const thongTinTaiKhoan = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await quanLyNguoiDungService.thongTinTaiKhoan(user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const capNhatAvatarTaiKhoan = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await quanLyNguoiDungService.capNhatAvatarTaiKhoan(req.file, user);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const capNhatAvatarNguoiDung = async (req, res, next) => {
    try {
        const idNguoiDung = req.body.idNguoiDung;

        const result = await quanLyNguoiDungService.capNhatAvatarNguoiDung(req.file, idNguoiDung);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const layDanhSachNguoiDung = async (req, res, next) => {
    try {
        const tenNguoiDung = req.query.tenNguoiDung;

        const result = await quanLyNguoiDungService.layDanhSachNguoiDung(tenNguoiDung);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const layThongTinNguoiDung = async (req, res, next) => {
    try {
        const idNguoiDung = req.query.idNguoiDung;

        const result = await quanLyNguoiDungService.layThongTinNguoiDung(idNguoiDung);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const capNhatMotThongTinNguoiDung = async (req, res, next) => {
    try {
        const thongTin = req.body;

        const result = await quanLyNguoiDungService.capNhatMotThongTinNguoiDung(thongTin);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const xoaNguoiDung = async (req, res, next) => {
    try {
        const idNguoiDung = req.query.idNguoiDung;

        const result = await quanLyNguoiDungService.xoaNguoiDung(idNguoiDung);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const layThongTinKhoaHocNguoiDung = async (req, res, next) => {
    try {
        const idNguoiDung = req.query.idNguoiDung;

        const result = await quanLyNguoiDungService.layThongTinKhoaHocNguoiDung(idNguoiDung);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const huyDangKyKhoaHocChoNguoiDung = async (req, res, next) => {
    try {
        const { idNguoiDung, idKhoaHoc } = req.body;

        const result = await quanLyNguoiDungService.huyDangKyKhoaHocChoNguoiDung(idNguoiDung, idKhoaHoc);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

const dangKyKhoaHocChoNguoiDung = async (req, res, next) => {
    try {
        const { idNguoiDung, idKhoaHoc } = req.body;

        const result = await quanLyNguoiDungService.dangKyKhoaHocChoNguoiDung(idNguoiDung, idKhoaHoc);

        res.status(result.code).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    dangKy,
    dangNhap,
    thongTinTaiKhoan,
    capNhatThongTinTaiKhoan,
    capNhatMotThongTinTaiKhoan,
    capNhatMatKhau,
    capNhatAvatarTaiKhoan,
    layDanhSachNguoiDung,
    layThongTinNguoiDung,
    capNhatMotThongTinNguoiDung,
    xoaNguoiDung,
    capNhatAvatarNguoiDung,
    layThongTinKhoaHocNguoiDung,
    huyDangKyKhoaHocChoNguoiDung,
    dangKyKhoaHocChoNguoiDung,
};
