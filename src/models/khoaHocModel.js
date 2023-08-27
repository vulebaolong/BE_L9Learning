const mongoose = require("mongoose");

const khoaHocSchema = new mongoose.Schema(
    {
        courseName: { type: String, unique: true, trim: true },
        moTa: { type: String, trim: true },
        ngayTao: { type: String, trim: true },
        danhMucKhoaHoc_ID: { type: mongoose.Schema.Types.ObjectId, ref: "danhMucKhoaHoc" },
        soLuongHocVien: { type: Number, trim: true, default: 0 },
        luotXem: { type: Number, trim: true, default: 0 },
        giaTien: { type: Number, trim: true },
        seHocDuoc: { type: [String], default: [] },
        chuongHoc: { type: [Object] },
        hinhAnh: { type: String, trim: true },
        tenHinhAnh: { type: String, trim: true },
    },
    {
        collection: "khoaHoc",
        timestamps: true,
    }
);

khoaHocSchema.index({ courseName: 'text' });

// Tạo model User dựa trên schema đã định nghĩa
const KhoaHocModel = mongoose.model("khoaHoc", khoaHocSchema);

// Xuất model User để sử dụng trong các module khác
module.exports = KhoaHocModel;
