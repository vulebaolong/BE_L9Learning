const isFileValidHelper = (file) => {
    // Kiểm tra xem biến có phải là một object không
    if (typeof file !== "object" || file === null) {
        return false;
    }

    // Kiểm tra các thuộc tính của file
    const requiredProps = ["fieldname", "originalname", "encoding", "mimetype", "buffer", "size"];
    return requiredProps.every((prop) => Object.prototype.hasOwnProperty.call(file, prop));
};

module.exports = isFileValidHelper;
