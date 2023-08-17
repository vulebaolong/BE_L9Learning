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



const capNhatThongTinNguoiDung = async (req, res, next) => {
    try {
        const user = req.user;
        const { email, hoTen, maLoaiNguoiDung, soDt, taiKhoan } = req.body;

        const result = await quanLyNguoiDungService.capNhatThongTinNguoiDung(email, hoTen, maLoaiNguoiDung, soDt, taiKhoan, user);

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


module.exports = {
    dangKy,
    dangNhap,
    thongTinTaiKhoan,
    capNhatThongTinNguoiDung,
    capNhatMatKhau,
};
