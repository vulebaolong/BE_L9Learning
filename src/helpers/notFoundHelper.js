const createError = require("http-errors");
const notFoundHelper = (req, res, next) => {
    next(createError(404, `Can't find ${req.originalUrl} on this sever!`));
};

module.exports = notFoundHelper
