"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
function isWriteOpSuccessful(insertResult) {
    return (insertResult.result &&
        !!insertResult.result.ok &&
        insertResult.result.n === 1);
}
exports.isWriteOpSuccessful = isWriteOpSuccessful;
function generateToken(payload) {
    return new Promise(function (resolve, reject) {
        jwt.sign(payload, "secretString", function (err, token) {
            if (!err) {
                resolve(token);
            }
            else {
                reject(err);
            }
        });
    });
}
exports.generateToken = generateToken;
function decodeToken(token) {
    return new Promise(function (resolve) {
        jwt.verify(token, "secretString", function (err, payload) {
            if (!err) {
                resolve(payload);
            }
            else {
                resolve(null);
            }
        });
    });
}
exports.decodeToken = decodeToken;
function sendError(res, description, errorCode) {
    res.status(errorCode || 500).send({
        result: false,
        description: description || "Unknown error",
    });
}
exports.sendError = sendError;
//# sourceMappingURL=utils.js.map