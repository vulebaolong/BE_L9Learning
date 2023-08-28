const mongoose = require("mongoose");
const validator = require("validator");
const { AVATAR_DEFAULT, BANNER_PROFILE_DEFAULT } = require("../contants/imgContant");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true, trim: true },
        password: { type: String, select: false },
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
        phoneNumber: { type: String, trim: true },
        fullName: { type: String, trim: true },
        userType: { type: String, trim: true, default: "Customer" },
        avatar: { type: String, trim: true, default: AVATAR_DEFAULT },
        avatarName: { type: String, trim: true },
        bannerProfile: { type: String, trim: true, default: BANNER_PROFILE_DEFAULT },
    },
    {
        collection: "users",
        timestamps: true,
    }
);

userSchema.path("password").select(false);

// Tạo model User dựa trên schema đã định nghĩa
const UserModel = mongoose.model("users", userSchema);

// Xuất model User để sử dụng trong các module khác
module.exports = UserModel;
