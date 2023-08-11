const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashedPassword = async (password) => {
    // tạo ra một chuỗi ngẫu nhiên
    const salt = await bcryptjs.genSalt(10);
    // mã hóa salt + password
    return await bcryptjs.hash(password, salt);
};

const checkPassword = async (userInputPassword, hashedPasswordFromDatabase) => {
    return await bcryptjs.compare(userInputPassword, hashedPasswordFromDatabase);
};

const createJwt = (payload, expiresIn) => {
    const secret = process.env.SECRET;

    if (!secret) return undefined;

    const token = jwt.sign(payload, secret, { expiresIn });

    return token;
};

const verifyJwt = (accessToken) => {
    const secret = process.env.SECRET;
    
    // Giải mã JWT
    const decodedToken = jwt.verify(accessToken, secret);

    // Lấy ra các thông tin trong JWT

    return decodedToken;
};

module.exports = {
    hashedPassword,
    createJwt,
    checkPassword,
    verifyJwt,
};
