const responsesHelper = (code, message, data, links) => {
    let status = "success";
    if (`${code}`.startsWith("4")) status = "fail";
    if (`${code}`.startsWith("5")) status = "error";
    if (!links) links = { docs: "https://doc.com/api" };

    return {
        code,
        result: {
            status,
            message,
            data,
            links,
        },
    };
};

module.exports = responsesHelper