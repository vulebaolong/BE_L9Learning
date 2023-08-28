const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        courseName: { type: String, unique: true, trim: true },
        description: { type: String, trim: true },
        courseCategory_ID: { type: mongoose.Schema.Types.ObjectId, ref: "courseCategory" },
        price: { type: Number, trim: true },
        willLearn: { type: [String], default: [] },
        lessons: { type: [Object] },
        image: { type: String, trim: true },
        imageName: { type: String, trim: true },
    },
    {
        collection: "courses",
        timestamps: true,
    }
);

courseSchema.index({ courseName: 'text' });

// Tạo model User dựa trên schema đã định nghĩa
const CourseModel = mongoose.model("courses", courseSchema);

// Xuất model User để sử dụng trong các module khác
module.exports = CourseModel;
