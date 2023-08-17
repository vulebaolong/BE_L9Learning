const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        taiKhoan: { type: String, unique: true, trim: true },
        matKhau: { type: String, select: false },
        email: {
            type: String,
            unique: true,
            validate: {
                validator: function (val) {
                    return validator.isEmail(val);
                },
                message: "Email không hợp lệ",
            },
        },
        soDt: { type: String, trim: true },
        hoTen: { type: String, trim: true },
        maLoaiNguoiDung: { type: String, trim: true, default: "KhachHang", },
        avatar: { type: String, trim: true, default: "https://firebasestorage.googleapis.com/v0/b/l9-learning-c6efa.appspot.com/o/avatas%2Favatar_default.jpg?alt=media&token=8614b721-30d1-4a02-ba34-2b1d1477f8d4", },
        bannerProfile: { type: String, trim: true, default: "https://firebasestorage.googleapis.com/v0/b/l9-learning-c6efa.appspot.com/o/bannerProfile%2Fbanner_profile_default.png?alt=media&token=e38ffa77-564c-4ffa-a986-1882fb291dd7", },
    },
    {
        collection: "users",
        timestamps: true,
    }
);

userSchema.path("matKhau").select(false);

// Tạo model User dựa trên schema đã định nghĩa
const UserModel = mongoose.model("users", userSchema);

// Xuất model User để sử dụng trong các module khác
module.exports = UserModel;
