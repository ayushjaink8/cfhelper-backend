const sendData = (res, message, data, status) => {
    res.status(status).send({
        message,
        data,
    });
};

function sendSuccess(res, message, data, status = 200) {
    sendData(res, message, data, status);
}

function sendError(res, message, errMsg, status = 500) {
    sendData(res, message, { msg: errMsg }, status);
}

module.exports = {
    sendSuccess,
    sendError
}
