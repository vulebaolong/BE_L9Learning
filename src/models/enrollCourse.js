const mongoose = require("mongoose");

const enrollCourseSchema = new mongoose.Schema(
    {
        course_ID: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
        user_ID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    },
    {
        collection: "enrollCourse",
        timestamps: true,
    }
);

// Tạo model User dựa trên schema đã định nghĩa
const EnrollCourseModel = mongoose.model("enrollCourse", enrollCourseSchema);

// Xuất model User để sử dụng trong các module khác
module.exports = EnrollCourseModel;
