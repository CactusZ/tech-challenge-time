"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var userCredentials_1 = require("../../settings/userCredentials");
var bcrypt = require("bcrypt");
var utils_1 = require("../utils");
var settings_1 = require("../settings");
function getLoginRoutes(usersService) {
    var _this = this;
    var router = express.Router();
    router.use(function (req, res, next) {
        if (isValidCredentialFormat(req.body, res)) {
            next();
        }
    });
    router.post("/login", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var credentials, user, isPasswordValid, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    credentials = req.body;
                    return [4 /*yield*/, usersService.getUser({
                            username: credentials.username
                        })];
                case 1:
                    user = _a.sent();
                    if (!!user) return [3 /*break*/, 2];
                    utils_1.sendError(res, "Wrong credentials", 401);
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, bcrypt.compare(credentials.password, user.password)];
                case 3:
                    isPasswordValid = _a.sent();
                    if (!isPasswordValid) return [3 /*break*/, 5];
                    return [4 /*yield*/, onSuccessfulLogin(credentials, res)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    utils_1.sendError(res, "Wrong credentials", 401);
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_1 = _a.sent();
                    next(e_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    router.post("/signup", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var credentials, existingUser, hash, insertResult, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    credentials = req.body;
                    return [4 /*yield*/, usersService.getUser({
                            username: credentials.username
                        })];
                case 1:
                    existingUser = _a.sent();
                    if (existingUser) {
                        utils_1.sendError(res, "Username exists!", 409);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, bcrypt.hash(credentials.password, settings_1.PASSWORD_SALT_ROUNDS)];
                case 2:
                    hash = _a.sent();
                    return [4 /*yield*/, usersService.addUser({
                            username: credentials.username,
                            password: hash
                        })];
                case 3:
                    insertResult = _a.sent();
                    if (!utils_1.isWriteOpSuccessful(insertResult)) return [3 /*break*/, 5];
                    return [4 /*yield*/, onSuccessfulLogin(credentials, res)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    utils_1.sendError(res, "", 500);
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    next(e_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    return router;
    function onSuccessfulLogin(credentials, res) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.generateToken({ username: credentials.username })];
                    case 1:
                        token = _a.sent();
                        res.cookie("auth-token", token, {
                            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
                        });
                        res.redirect("/home");
                        return [2 /*return*/];
                }
            });
        });
    }
}
exports.default = getLoginRoutes;
function isValidCredentialFormat(credentials, res) {
    var _a = validateCredentialsFormat(credentials), isValidCredentialFormat = _a.result, description = _a.description;
    if (!isValidCredentialFormat) {
        utils_1.sendError(res, description, 401);
        return false;
    }
    return true;
}
function validateCredentialsFormat(credentials) {
    if (!credentials) {
        return { result: false, description: "Credentials undefined" };
    }
    if (!isValidUsername(credentials)) {
        return { result: false, description: "Username not valid" };
    }
    if (!isValidPassword(credentials)) {
        return { result: false, description: "Password not valid" };
    }
    return {
        result: true
    };
}
function isValidPassword(credentials) {
    return (credentials.password &&
        credentials.password.length >= userCredentials_1.MIN_PASSWORD_LENGTH);
}
function isValidUsername(credentials) {
    return (credentials.username &&
        credentials.username.length >= userCredentials_1.MIN_USERNAME_LENGTH &&
        credentials.username.length <= userCredentials_1.MAX_USERNAME_LENGTH);
}
//# sourceMappingURL=login.js.map