const createMessage = (err) => {
    let message = err.message || "Internal Server Eror";
    if (err.code === 11000) message = `${Object.keys(err.keyValue)[0]}: ${err.keyValue[`${Object.keys(err.keyValue)[0]}`]} đã tồn tại`;
    return message;
};

const errorHelper = (err, req, res, next) => {
    console.dir(err);

    const message = createMessage(err);
    const statusCode = err.status || 500;
    const status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    res.status(statusCode).json({
        code: err.code,
        result: {
            status,
            message,
            data: null,
            links: {
                docs: "https://doc.com/api",
            },
        },
    });
};

module.exports = errorHelper;
