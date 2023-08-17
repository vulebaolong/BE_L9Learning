const { verifyJwt } = require("../helpers/authHelper");
const responsesHelper = require("../helpers/responsesHelper");

const protect = async (req, res, next) => {
    const accessToken = req.headers.authorization;
    // console.log(req.headers.authorization);

    //Nếu không có token hoặc không bắt đầu bằng "Bearer ", chúng ta trả về lỗi "Không Đủ Quyền Truy Cập"
    if (!accessToken || !accessToken.startsWith("Bearer ")) return res.status(400).json(responsesHelper(400, "Xử Lý Không Thành Công", "Không Đủ Quyền Truy Cập"));

    const token = accessToken.split(" ")[1];
    //Nếu token có giá trị "null", chúng ta cũng trả về lỗi "Không Đủ Quyền Truy Cập".
    if (!token || token === "null") return res.status(400).json(responsesHelper(400, "Xử Lý Không Thành Công", "Không Đủ Quyền Truy Cập"));

    const decodedToken = verifyJwt(token);
    //Nếu token có tồn tại nhưng không hợp lệ (không thể xác thực), chúng ta trả về lỗi "Token Không Hợp Lệ".
    if (!decodedToken) return res.status(400).json(responsesHelper(400, "Xử Lý Không Thành Công", "Token Không Hợp Lệ"));

    req.user = decodedToken;

    next();
};

module.exports = protect;
