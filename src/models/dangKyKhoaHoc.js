const mongoose = require("mongoose");

const dangKyKhoaHocSchema = new mongoose.Schema(
    {
        khoaHoc_ID: { type: mongoose.Schema.Types.ObjectId, ref: "khoaHoc" },
        user_ID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    },
    {
        collection: "dangKyKhoaHoc",
        timestamps: true,
    }
);

// Tạo model User dựa trên schema đã định nghĩa
const DangKyKhoaHocModel = mongoose.model("dangKyKhoaHoc", dangKyKhoaHocSchema);

// Xuất model User để sử dụng trong các module khác
module.exports = DangKyKhoaHocModel;
