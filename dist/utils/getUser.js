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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
var context_1 = require("../context");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var signJWT_1 = require("./signJWT");
function getUserSession(sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var session, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context_1.prisma.session.findUnique({
                        where: {
                            id: sessionId,
                        },
                    })];
                case 1:
                    session = _a.sent();
                    if (!session) return [3 /*break*/, 3];
                    return [4 /*yield*/, context_1.prisma.user.findUnique({
                            where: {
                                id: session.userId,
                            },
                        })];
                case 2:
                    user = _a.sent();
                    if (user) {
                        return [2 /*return*/, { user: user, session: session }];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
function checkRefreshToken(req) {
    return __awaiter(this, void 0, void 0, function () {
        var refreshToken, verifyRefreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refreshToken = req.cookies["refreshToken"];
                    if (!refreshToken) return [3 /*break*/, 2];
                    verifyRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_PRIVATE_KEY);
                    return [4 /*yield*/, getUserSession(verifyRefreshToken.sessionId).then(function (_a) {
                            var user = _a.user;
                            return { user: user };
                        })];
                case 1: 
                // @ts-ignore
                return [2 /*return*/, _a.sent()];
                case 2: return [2 /*return*/, { user: null }];
            }
        });
    });
}
function checkAccessToken(req) {
    var accessToken = req.cookies["accessToken"];
    if (accessToken) {
        return jsonwebtoken_1.default.verify(accessToken, process.env.JWT_PRIVATE_KEY);
    }
    return null;
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userWithAccessToken, payload;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userWithAccessToken = checkAccessToken(req);
                    if (userWithAccessToken) {
                        return [2 /*return*/, {
                                accessToken: userWithAccessToken,
                                refreshToken: null,
                                accessTokenPayload: null,
                                refreshTokenPayload: null,
                            }];
                    }
                    return [4 /*yield*/, checkRefreshToken(req)
                            .then(function (_a) {
                            var user = _a.user;
                            return __awaiter(_this, void 0, void 0, function () {
                                var _b, accessToken, refreshToken, accessTokenPayload, refreshTokenPayload;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!user) {
                                                return [2 /*return*/, { accessToken: null, refreshToken: null }];
                                            }
                                            return [4 /*yield*/, (0, signJWT_1.signJWT)({ res: res, user: user })];
                                        case 1:
                                            _b = _c.sent(), accessToken = _b.accessToken, refreshToken = _b.refreshToken, accessTokenPayload = _b.accessTokenPayload, refreshTokenPayload = _b.refreshTokenPayload;
                                            return [2 /*return*/, {
                                                    accessToken: accessToken,
                                                    refreshToken: refreshToken,
                                                    accessTokenPayload: accessTokenPayload,
                                                    refreshTokenPayload: refreshTokenPayload,
                                                }];
                                    }
                                });
                            });
                        })
                            .then(function (_a) {
                            var accessToken = _a.accessToken, refreshToken = _a.refreshToken, _b = _a.accessTokenPayload, accessTokenPayload = _b === void 0 ? null : _b, _c = _a.refreshTokenPayload, refreshTokenPayload = _c === void 0 ? null : _c;
                            return {
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                accessTokenPayload: accessTokenPayload,
                                refreshTokenPayload: refreshTokenPayload
                            };
                        })];
                case 1:
                    payload = _a.sent();
                    if (payload) {
                        return [2 /*return*/, payload];
                    }
                    return [2 /*return*/, {
                            accessToken: null,
                            refreshToken: null,
                            accessTokenPayload: null,
                            refreshTokenPayload: null,
                        }];
            }
        });
    });
}
exports.getUser = getUser;
//# sourceMappingURL=getUser.js.map