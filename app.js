//app.js
const express = require("express");
const routers = require("./src/routers");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const helmet = require("helmet");
const responsesHelper = require("./src/helpers/responsesHelper.js");


const app = express();

// Danh sách các đường dẫn được cho phép truy cập
// const allowedOrigins = ["https://netflix-vulebaolong.netlify.app"];
const allowedOrigins = ["https://l9-learning-vulebaolong.netlify.app"];

const corsOptions = {
    origin: function (origin, callback) {
        // console.log("origin: ", origin);
        // Kiểm tra xem origin có trong danh sách allowedOrigins hay không
        if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Cho phép truy cập
        } else {
            callback(new Error("Không cho phép truy cập từ nguồn này")); // Từ chối truy cập
        }
    },
};

// app.use(cors(corsOptions));
// app.use(cors());

//  ===============MIDLEWARAE =========================
// bảo vệ cho phép tài nguyên trong ứng dụng của bạn được truy cập từ các nguồn gốc khác nhau
app.use(
  helmet({
      contentSecurityPolicy: true,
      crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// limit giới hạn tần suất các yêu cầu (requests) từ một địa chỉ IP cụ thể
const limiter = () => {
  const { result } = responsesHelper(429, "Quá nhiều yêu cầu, vui lòng thử lại sau.");
  return rateLimit({
      windowMs: 1000, // 2 giây Thời gian cửa sổ (ms)
      max: 10, // Số lượng yêu cầu tối đa trong cửa sổ thời gian
      message: result, // Thông báo lỗi khi vượt quá giới hạn
  });
};
app.use("/api", limiter());

// ngăn chặn các cuộc tấn công NoSQL Injection vào MongoDB khi sử dụng Mongoose
app.use(mongoSanitize());

// nén (compress) các tài nguyên HTTP trước khi gửi từ máy chủ (server) tới trình duyệt (browser)
app.use(compression());

// express.json(): body => JSON
app.use(express.json());
//  ===============MIDLEWARAE =========================


app.use("/api/v1", routers);

module.exports = app;
