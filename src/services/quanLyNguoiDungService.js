const responsesHelper = require("../helpers/responsesHelper");
const UserModel = require("../models/userModel");
const DangKyKhoaHocModel = require("../models/dangKyKhoaHoc");
const { hashedPassword } = require("../helpers/authHelper");
const { createJwt } = require("../helpers/authHelper");
const { checkPassword } = require("../helpers/authHelper");
const { uploadImg, deleteImg } = require("../helpers/ImgHelper");
const isFileValidHelper = require("../helpers/isFileValidHelper");
const { AVATAR_DEFAULT } = require("../contants/imgContant");
const wait = require("../helpers/waitHelper");
const KhoaHocModel = require("../models/khoaHocModel");
const changeObj = require("../helpers/changeObjHelper");

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

    const chiTietKhoaHocGhiDanh = await DangKyKhoaHocModel.find({ user_ID: user._id })
        .select("-__v -updatedAt -createdAt -user_ID")
        .populate("khoaHoc_ID", "hinhAnh moTa tenKhoaHoc");

    const chiTietKhoaHocGhiDanhResult = chiTietKhoaHocGhiDanh.map((item) => {
        return item.khoaHoc_ID;
    });

    return responsesHelper(200, "Đăng nhập thành công", {
        chiTietKhoaHocGhiDanh: chiTietKhoaHocGhiDanhResult,
        id: user._id,
        taiKhoan: user.taiKhoan,
        email: user.email,
        soDt: user.soDt,
        hoTen: user.hoTen,
        accessToken,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
        avatar: user.avatar,
        bannerProfile: user.bannerProfile,
    });
};

const thongTinTaiKhoan = async (user) => {
    const userReturn = await UserModel.findById(user.id);

    const chiTietKhoaHocGhiDanh = await DangKyKhoaHocModel.find({ user_ID: user.id })
        .select("-__v -updatedAt -createdAt -user_ID")
        .populate("khoaHoc_ID", "hinhAnh moTa tenKhoaHoc");

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

const capNhatThongTinTaiKhoan = async (email, hoTen, maLoaiNguoiDung, soDt, taiKhoan, user) => {
    if (!email) return responsesHelper(400, "Thiếu email");
    if (!hoTen) return responsesHelper(400, "Thiếu họ tên");
    if (!maLoaiNguoiDung) return responsesHelper(400, "Thiếu mã loại nơiời dùng");
    if (!soDt) return responsesHelper(400, "Thiếu số điện thoại");
    if (!taiKhoan) return responsesHelper(400, "Thiếu tài khoản");

    const userUpdate = await UserModel.findByIdAndUpdate(user.id, { email, hoTen, maLoaiNguoiDung, soDt, taiKhoan }, { new: true });

    return responsesHelper(200, "Xử lý thành công", userUpdate);
};

const capNhatMotThongTinTaiKhoan = async (body, user) => {
    const keys = Object.keys(body);

    const key = keys[0];

    if (!key) return responsesHelper(400, "Thiếu thông tin cần sửa");
    if (key === "matKhau") return responsesHelper(400, "Vui lòng dùng api capNhatMatKhau");
    if (key === "avatar") return responsesHelper(400, "Vui lòng dùng api capNhatAvatar");
    if (key === "bannerProfile") return responsesHelper(400, "Vui lòng dùng api capNhatBannerProfile");

    const updatedUser = await UserModel.findByIdAndUpdate(user.id, { [key]: body[key] }, { new: true });

    return responsesHelper(200, "Xử lý thành công", updatedUser);
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

const capNhatAvatarTaiKhoan = async (file, user) => {
    // console.log(file);
    // console.log(user);

    if (!file) return responsesHelper(200, "Giữ lại hình ảnh cũ, không nhận được hình ảnh mới");

    const userDb = await UserModel.findById(user.id);

    if (!userDb) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    // Trường hợp thay đổi avart không xoá AVATAR_DEFAULT
    if (userDb.avatar === AVATAR_DEFAULT) {
        console.log("Trường hợp thay đổi avart không xoá AVATAR_DEFAULT");
        const hinhAnhNew = await uploadImg(file, "avatas");
        const userUpdate = await UserModel.findByIdAndUpdate(
            userDb._id,
            {
                avatar: hinhAnhNew.hinhAnh,
                tenAvatar: hinhAnhNew.tenHinhAnh,
            },
            { new: true }
        );
        return responsesHelper(200, "Xử lý thành công", userUpdate);
    }

    // Trường hợp thay đổi avart xoá avatar cũ
    if (userDb.avatar !== AVATAR_DEFAULT) {
        console.log("Trường hợp thay đổi avart xoá avatar cũ");
        // xoá ảnh cũ
        const isDeleteImg = await deleteImg(userDb.tenAvatar);

        if (!isDeleteImg) return responsesHelper(400, "Xử lý deleteImg hình ảnh không thành công");

        // thêm ảnh mới
        if (isDeleteImg) hinhAnhNew = await uploadImg(file, "avatas");

        const userUpdate = await UserModel.findByIdAndUpdate(
            userDb._id,
            {
                avatar: hinhAnhNew.hinhAnh,
                tenAvatar: hinhAnhNew.tenHinhAnh,
            },
            { new: true }
        );
        return responsesHelper(200, "Xử lý thành công", userUpdate);
    }

    return responsesHelper(400, "Có vấn đề, không rơi vào 1 trong 2 trường hợp có và không có AVATAR_DEFAULT");
};

const capNhatAvatarNguoiDung = async (file, idNguoiDung) => {
    console.log(file);
    console.log(idNguoiDung);
    if (!file) return responsesHelper(200, "Giữ lại hình ảnh cũ, không nhận được hình ảnh mới");

    const userDb = await UserModel.findById(idNguoiDung);

    if (!userDb) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    // Trường hợp thay đổi avart không xoá AVATAR_DEFAULT
    if (userDb.avatar === AVATAR_DEFAULT) {
        console.log("Trường hợp thay đổi avart không xoá AVATAR_DEFAULT");
        const hinhAnhNew = await uploadImg(file, "avatas");
        const userUpdate = await UserModel.findByIdAndUpdate(
            userDb._id,
            {
                avatar: hinhAnhNew.hinhAnh,
                tenAvatar: hinhAnhNew.tenHinhAnh,
            },
            { new: true }
        );
        return responsesHelper(200, "Xử lý thành công", userUpdate);
    }

    // Trường hợp thay đổi avart xoá avatar cũ
    if (userDb.avatar !== AVATAR_DEFAULT) {
        console.log("Trường hợp thay đổi avart xoá avatar cũ");
        // xoá ảnh cũ
        const isDeleteImg = await deleteImg(userDb.tenAvatar);

        if (!isDeleteImg) return responsesHelper(400, "Xử lý deleteImg hình ảnh không thành công");

        // thêm ảnh mới
        if (isDeleteImg) hinhAnhNew = await uploadImg(file, "avatas");

        const userUpdate = await UserModel.findByIdAndUpdate(
            userDb._id,
            {
                avatar: hinhAnhNew.hinhAnh,
                tenAvatar: hinhAnhNew.tenHinhAnh,
            },
            { new: true }
        );
        return responsesHelper(200, "Xử lý thành công", userUpdate);
    }

    return responsesHelper(400, "Có vấn đề, không rơi vào 1 trong 2 trường hợp có và không có AVATAR_DEFAULT");
    // return responsesHelper(200, "Xử lý thành công", file);
};

const layDanhSachNguoiDung = async (tenNguoiDung) => {
    if (!tenNguoiDung) {
        const danhSachNguoiDung = await UserModel.find().select("-createdAt -updatedAt -__v");

        // await wait(3000)

        return responsesHelper(200, "Xử lý thành công", danhSachNguoiDung);
    }

    const fuzzySearchQuery = _.escapeRegExp(tenNguoiDung);

    const danhSachNguoiDung = await UserModel.find({ tenNguoiDung: { $regex: fuzzySearchQuery, $options: "i" } }).select("-createdAt -updatedAt -__v");

    return responsesHelper(200, "Xử lý thành công", danhSachNguoiDung);
};

const layThongTinNguoiDung = async (idNguoiDung) => {
    if (!idNguoiDung) return responsesHelper(400, "Thiếu idNguoiDung tài khoản");

    const nguoiDung = await UserModel.findById(idNguoiDung).select("-createdAt -updatedAt -__v");
    if (!nguoiDung) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    return responsesHelper(200, "Xử lý thành công", nguoiDung);
};

const capNhatMotThongTinNguoiDung = async (thongTin) => {
    const { idNguoiDung, ...newObject } = thongTin;
    if (!idNguoiDung) return responsesHelper(400, "Thiếu idNguoiDung");

    // Kiểm tra idNguoiDung có tồn tại người dùng không
    const userDb = await UserModel.findById(idNguoiDung);
    if (!userDb) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    const keys = Object.keys(newObject);

    const key = keys[0];

    if (!key) return responsesHelper(400, "Thiếu thông tin cần sửa");
    if (key === "matKhau") return responsesHelper(400, "Vui lòng dùng api capNhatMatKhau");
    if (key === "avatar") return responsesHelper(400, "Vui lòng dùng api capNhatAvatar");
    if (key === "bannerProfile") return responsesHelper(400, "Vui lòng dùng api capNhatBannerProfile");

    const updatedUser = await UserModel.findByIdAndUpdate(userDb._id, { [key]: newObject[key] }, { new: true });

    return responsesHelper(200, "Xử lý thành công", updatedUser);
};

const xoaNguoiDung = async (idNguoiDung) => {
    if (!idNguoiDung) return responsesHelper(400, "Thiếu idNguoiDung tài khoản");

    // Kiểm tra idNguoiDung có tồn tại người dùng không
    const userDb = await UserModel.findById(idNguoiDung);
    if (!userDb) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    // Xoá người dùng
    const deletedNguoiDung = await UserModel.findByIdAndDelete(userDb._id).select("-createdAt -updatedAt -__v");

    // xóa tất cả các documents có user_ID
    await DangKyKhoaHocModel.deleteMany({ user_ID: deletedNguoiDung._id });

    // Trường hợp đã từng thay đổi avatar nên phải xoá avatar
    if (deletedNguoiDung.avatar !== AVATAR_DEFAULT) {
        const isDeleteImg = await deleteImg(deletedNguoiDung.tenAvatar);
        if (!isDeleteImg) return responsesHelper(400, "Xử lý deleteImg hình ảnh không thành công");
    }

    return responsesHelper(200, "Xử lý thành công", deletedNguoiDung);
};

const layThongTinKhoaHocChoNguoiDung = async (idNguoiDung) => {
    if (!idNguoiDung) return responsesHelper(400, "Thiếu idNguoiDung tài khoản");

    const nguoiDung = await UserModel.findById(idNguoiDung).select("-createdAt -updatedAt -__v");
    if (!nguoiDung) return responsesHelper(400, "Xử lý không thành công", `Người dùng không tồn tại`);

    // LỌC KHOÁ HỌC ĐÃ ĐĂNG KÝ =================================================================
    let khoaHocDaDangKy = changeObj(
        await DangKyKhoaHocModel.find({ user_ID: nguoiDung._id }).select("-__v -updatedAt -createdAt -user_ID").populate("khoaHoc_ID", "hinhAnh tenKhoaHoc")
    );
    khoaHocDaDangKy = khoaHocDaDangKy.map((khoaHoc) => {
        return { ...khoaHoc.khoaHoc_ID };
    });

    // LỌC KHOÁ HỌC CHƯA ĐĂNG KÝ ===============================================================
    const arrIdKhoaHocDaDangKy = khoaHocDaDangKy.map((khoaHoc) => khoaHoc._id);

    // từ mảng các id chứa khoá học đã đăng ký: arrIdKhoaHocDaDangKy
    // tìm kiếm trong KhoaHocModel những documents không có trong arrIdKhoaHocDaDangKy
    const khoaHocChuaDangKy = await KhoaHocModel.find({ _id: { $nin: arrIdKhoaHocDaDangKy } }).select("hinhAnh tenKhoaHoc");

    const result = {
        nguoiDung,
        khoaHocDaDangKy,
        khoaHocChuaDangKy,
    };
    return responsesHelper(200, "Xử lý thành công", result);
};

const huyDangKyKhoaHocChoNguoiDung = async (idNguoiDung, idKhoaHoc) => {
    if (!idNguoiDung) return responsesHelper(400, "Thiếu idNguoiDung");
    if (!idKhoaHoc) return responsesHelper(400, "Thiếu idKhoaHoc");

    const result = await DangKyKhoaHocModel.deleteMany({ khoaHoc_ID: idKhoaHoc, user_ID: idNguoiDung });

    return responsesHelper(200, "Xử lý thành công", result);
};

const dangKyKhoaHocChoNguoiDung = async (idNguoiDung, idKhoaHoc) => {
    if (!idNguoiDung) return responsesHelper(400, "Thiếu idNguoiDung");
    if (!idKhoaHoc) return responsesHelper(400, "Thiếu idKhoaHoc");

    const result = await DangKyKhoaHocModel.create({ khoaHoc_ID: idKhoaHoc, user_ID: idNguoiDung });

    return responsesHelper(200, "Xử lý thành công",  result);
};

module.exports = {
    dangKy,
    dangNhap,
    thongTinTaiKhoan,
    capNhatThongTinTaiKhoan,
    capNhatMotThongTinTaiKhoan,
    capNhatMatKhau,
    capNhatAvatarTaiKhoan,
    capNhatAvatarNguoiDung,
    layDanhSachNguoiDung,
    layThongTinNguoiDung,
    capNhatMotThongTinNguoiDung,
    xoaNguoiDung,
    layThongTinKhoaHocChoNguoiDung,
    huyDangKyKhoaHocChoNguoiDung,
    dangKyKhoaHocChoNguoiDung,
};
