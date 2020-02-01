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
var uuid_1 = require("uuid");
var collections_1 = require("../collections");
var utils_1 = require("../utils");
var SessionsService = /** @class */ (function () {
    function SessionsService(databaseConnectionFactory) {
        this.databaseConnectionFactory = databaseConnectionFactory;
    }
    SessionsService.prototype.createSession = function (sessionData, user) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var session, db;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!((_a = user) === null || _a === void 0 ? void 0 : _a._id) ||
                            !((_b = sessionData) === null || _b === void 0 ? void 0 : _b.start) ||
                            !sessionData.end ||
                            !sessionData.name) {
                            return [2 /*return*/, false];
                        }
                        session = {
                            _id: uuid_1.v4(),
                            start: sessionData.start,
                            end: sessionData.end,
                            name: sessionData.name,
                            userId: user._id
                        };
                        return [4 /*yield*/, this.databaseConnectionFactory()];
                    case 1:
                        db = _c.sent();
                        return [2 /*return*/, db
                                .collection(collections_1.SESSIONS_COLLECTION_NAME)
                                .insertOne(session)
                                .then(utils_1.isWriteOpSuccessful)];
                }
            });
        });
    };
    SessionsService.prototype.getSessions = function (user, filter, pagination) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var serverFilter, db, cursor, pageSize, skip, sessions, count;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!((_a = user) === null || _a === void 0 ? void 0 : _a._id)) {
                            return [2 /*return*/, []];
                        }
                        serverFilter = { userId: user._id };
                        if ((_b = filter) === null || _b === void 0 ? void 0 : _b.start) {
                            serverFilter.start = { $gte: filter.start };
                        }
                        if ((_c = filter) === null || _c === void 0 ? void 0 : _c.end) {
                            serverFilter.end = { $lte: filter.end };
                        }
                        return [4 /*yield*/, this.databaseConnectionFactory()];
                    case 1:
                        db = _f.sent();
                        cursor = db
                            .collection(collections_1.SESSIONS_COLLECTION_NAME)
                            .find(serverFilter);
                        if (typeof ((_d = pagination) === null || _d === void 0 ? void 0 : _d.page) === "number") {
                            pageSize = (pagination.pageSize || 10);
                            skip = pagination.page * pageSize;
                            cursor = cursor.skip(skip).limit(pageSize);
                        }
                        if ((_e = pagination) === null || _e === void 0 ? void 0 : _e.sortParam) {
                            cursor = cursor.sort(pagination.sortParam, pagination.sortOrder || 1);
                        }
                        return [4 /*yield*/, cursor.toArray()];
                    case 2:
                        sessions = _f.sent();
                        return [4 /*yield*/, cursor.count()];
                    case 3:
                        count = _f.sent();
                        return [2 /*return*/, {
                                elements: sessions,
                                totalCount: count,
                            }];
                }
            });
        });
    };
    return SessionsService;
}());
exports.default = SessionsService;
//# sourceMappingURL=sessions-service.js.map