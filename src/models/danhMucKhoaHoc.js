const mongoose = require("mongoose");

const danhMucKhoaHocSchema = new mongoose.Schema(
    {
        tenDanhMuc: { type: String, unique: true, trim: true },
    },
    {
        collection: "danhMucKhoaHoc",
        timestamps: true,
    }
);

// Tạo model User dựa trên schema đã định nghĩa
const DanhMucKhoaHocModel = mongoose.model("danhMucKhoaHoc", danhMucKhoaHocSchema);

// Xuất model User để sử dụng trong các module khác
module.exports = DanhMucKhoaHocModel;
