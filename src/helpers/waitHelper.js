const wait = function (miliseconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, miliseconds);
    });
};

module.exports = wait