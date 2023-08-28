const mongoose = require("mongoose");

const courseCategorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, unique: true, trim: true },
    },
    {
        collection: "courseCategory",
        timestamps: true,
    }
);

// Tạo model User dựa trên schema đã định nghĩa
const CourseCategoryModel = mongoose.model("courseCategory", courseCategorySchema);

// Xuất model User để sử dụng trong các module khác
module.exports = CourseCategoryModel;
