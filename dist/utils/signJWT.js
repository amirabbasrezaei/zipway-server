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
exports.signJWT = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var context_1 = require("../context");
function createSession(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var createdSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context_1.prisma.session.create({
                        data: {
                            userId: userId,
                        },
                    })];
                case 1:
                    createdSession = _a.sent();
                    return [2 /*return*/, createdSession];
            }
        });
    });
}
function setAccessToken(res, user) {
    var accessTokenPayload = {
        phoneNumber: user.phoneNumber,
        role: user.role,
        userId: user.id,
    };
    var accessToken = jsonwebtoken_1.default.sign(accessTokenPayload, process.env.JWT_PRIVATE_KEY, {
        expiresIn: Date.now() + 300000,
    });
    res.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 300000),
        httpOnly: true,
    });
    return { accessToken: accessToken, accessTokenPayload: accessTokenPayload };
}
function setRefreshToken(res, user) {
    return __awaiter(this, void 0, void 0, function () {
        var session, refreshTokenPayload, refreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createSession(user.id)];
                case 1:
                    session = _a.sent();
                    refreshTokenPayload = {
                        sessionId: session.id,
                        userId: session.userId,
                    };
                    return [4 /*yield*/, jsonwebtoken_1.default.sign(refreshTokenPayload, process.env.JWT_PRIVATE_KEY, {
                            expiresIn: Date.now() + 3.156e+10,
                        })];
                case 2:
                    refreshToken = _a.sent();
                    return [4 /*yield*/, res.cookie("refreshToken", refreshToken, {
                            expires: new Date(Date.now() + 3.156e+10),
                            httpOnly: true,
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { refreshToken: refreshToken, refreshTokenPayload: refreshTokenPayload }];
            }
        });
    });
}
function signJWT(_a) {
    var res = _a.res, user = _a.user;
    return __awaiter(this, void 0, void 0, function () {
        var _b, accessToken, accessTokenPayload;
        return __generator(this, function (_c) {
            _b = setAccessToken(res, user), accessToken = _b.accessToken, accessTokenPayload = _b.accessTokenPayload;
            return [2 /*return*/, setRefreshToken(res, user)
                    .then(function (_a) {
                    var refreshToken = _a.refreshToken, refreshTokenPayload = _a.refreshTokenPayload;
                    return {
                        accessToken: accessToken,
                        accessTokenPayload: accessTokenPayload,
                        refreshToken: refreshToken,
                        refreshTokenPayload: refreshTokenPayload,
                    };
                }).catch(function (err) {
                    console.log(err);
                    return {
                        accessToken: accessToken,
                        accessTokenPayload: accessTokenPayload,
                        refreshToken: null,
                        refreshTokenPayload: null,
                    };
                })];
        });
    });
}
exports.signJWT = signJWT;
//# sourceMappingURL=signJWT.js.map