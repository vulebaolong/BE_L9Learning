const responsesHelper = require("../helpers/responsesHelper");
const UserModel = require("../models/userModel");
const DangKyKhoaHocModel = require("../models/dangKyKhoaHoc");
const { hashedPassword } = require("../helpers/authHelper");
const { createJwt } = require("../helpers/authHelper");
const { checkPassword } = require("../helpers/authHelper");

const dangKy = async (taiKhoan, matKhau, email, soDt, hoTen) => {
    if (!taiKhoan) return responsesHelper(400, "Thiếu tài khoản");
    if (!matKhau) return responsesHelper(400, "Thiếu mật khẩu");
    if (!email) return responsesHelper(400, "Thiếu email");
    if (!soDt) return responsesHelper(400, "Thiếu số điện thoại");
    if (!hoTen) return responsesHelper(400, "Thiếu họ và tên");

    const matKhauMoi = await hashedPassword(matKhau);

    const user = await UserModel.create({
        taiKhoan,
        matKhau: matKhauMoi,
        email,
        soDt,
        hoTen,
    });

    return responsesHelper(200, "Xử lý thành công", {
        id: user._id,
        taiKhoan: user.taiKhoan,
        email: user.email,
        soDt: user.soDt,
        hoTen: user.hoTen,
        matKhau,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
    });
};

const dangNhap = async (taiKhoan, matKhau) => {
    if (!taiKhoan) return responsesHelper(400, "Thiếu tài khoản");
    if (!matKhau) return responsesHelper(400, "Thiếu mật khẩu");

    const user = await UserModel.findOne({ taiKhoan }).select("+matKhau");
    if (!user) return responsesHelper(401, "Tài khoản không tồn tại");

    const isMatKhau = await checkPassword(matKhau, user.matKhau);
    if (!isMatKhau) return responsesHelper(401, "Mật khẩu không đúng");

    // tạo token
    const accessToken = createJwt({ id: `${user._id}`, taiKhoan: user.taiKhoan, email: user.email, soDt: user.soDt, hoTen: user.hoTen }, "90d");
    if (!accessToken) return responsesHelper(500, "Lỗi server: Không tạo được token");

    return responsesHelper(200, "Đăng nhập thành công", {
        id: user._id,
        taiKhoan: user.taiKhoan,
        email: user.email,
        soDt: user.soDt,
        hoTen: user.hoTen,
        accessToken,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
        avatar: user.avatar,
    });
};

const thongTinTaiKhoan = async (user) => {
    const userReturn = await UserModel.findById(user.id);

    const chiTietKhoaHocGhiDanh = await DangKyKhoaHocModel.find({ user_ID: user.id }).select("-__v -updatedAt -createdAt -user_ID").populate("khoaHoc_ID", "hinhAnh moTa tenKhoaHoc");
    const chiTietKhoaHocGhiDanhResult = chiTietKhoaHocGhiDanh.map((item) => {
        return item.khoaHoc_ID;
    });
    return responsesHelper(200, "Xử lý thành công", {
        chiTietKhoaHocGhiDanh: chiTietKhoaHocGhiDanhResult,
        id: userReturn._id,
        taiKhoan: userReturn.taiKhoan,
        email: userReturn.email,
        soDt: userReturn.soDt,
        hoTen: userReturn.hoTen,
        maLoaiNguoiDung: userReturn.maLoaiNguoiDung,
        bannerProfile: userReturn.bannerProfile,
        avatar: userReturn.avatar,
    });
};

const capNhatThongTinNguoiDung = async (email, hoTen, maLoaiNguoiDung, soDt, taiKhoan, user) => {
    if (!email) return responsesHelper(400, "Thiếu email");
    if (!hoTen) return responsesHelper(400, "Thiếu họ tên");
    if (!maLoaiNguoiDung) return responsesHelper(400, "Thiếu mã loại nơiời dùng");
    if (!soDt) return responsesHelper(400, "Thiếu số điện thoại");
    if (!taiKhoan) return responsesHelper(400, "Thiếu tài khoản");

    const userUpdate = await UserModel.findByIdAndUpdate(user.id, { email, hoTen, maLoaiNguoiDung, soDt, taiKhoan }, { new: true });

    return responsesHelper(200, "Xử lý thành công", userUpdate);
};

const capNhatMatKhau = async (matKhauCurent, matKhauNew, user) => {
    if (!matKhauCurent) return responsesHelper(400, "Thiếu mật khẩu hiện tại");
    if (!matKhauNew) return responsesHelper(400, "Thiếu mật khẩu mới");

    const userDb = await UserModel.findById(user.id).select("+matKhau");
    const matKhauDb = userDb.matKhau;

    // kiểm tra mật khẩu current
    const isMatKhauCurrent = await checkPassword(matKhauCurent, matKhauDb);
    if (!isMatKhauCurrent) return responsesHelper(400, "Xử lý không thành công", "Mật khẩu hiện tại không chính xác");

    // mã hoá mật khẩu mới
    const matKhauNewDb = await hashedPassword(matKhauNew);

    // lưu mật khẩu mới vào db
    await UserModel.findByIdAndUpdate(user.id, { matKhau: matKhauNewDb });

    return responsesHelper(200, "Xử lý thành công", "Thay đổi mật khẩu thành công");
};

module.exports = {
    dangKy,
    dangNhap,
    thongTinTaiKhoan,
    capNhatThongTinNguoiDung,
    capNhatMatKhau,
};
