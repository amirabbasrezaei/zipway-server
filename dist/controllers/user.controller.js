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
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.verifyLoginCodeController = exports.VerifyLoginCodeSchema = exports.sendVerifyCodeController = exports.SendVerifyCodeSchema = exports.createUserController = exports.createUserSchema = void 0;
var zod_1 = require("zod");
var signJWT_1 = require("../utils/signJWT");
var server_1 = require("@trpc/server");
var sms_controller_1 = require("./sms.controller");
/// create user
exports.createUserSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string(),
    nameAndFamily: zod_1.z.string(),
});
function createUserController(_a) {
    var ctx = _a.ctx, input = _a.input;
    return __awaiter(this, void 0, void 0, function () {
        var prisma, res, phoneNumber, nameAndFamily, findUser, createdUser, _b, accessToken, refreshToken;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    prisma = ctx.prisma, res = ctx.res;
                    phoneNumber = input.phoneNumber, nameAndFamily = input.nameAndFamily;
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: {
                                phoneNumber: phoneNumber,
                            },
                        })];
                case 1:
                    findUser = _c.sent();
                    if (findUser) {
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: "user already exists",
                        });
                    }
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                phoneNumber: phoneNumber,
                                name: nameAndFamily,
                            },
                        })];
                case 2:
                    createdUser = _c.sent();
                    return [4 /*yield*/, (0, signJWT_1.signJWT)({
                            res: res,
                            user: createdUser,
                        })];
                case 3:
                    _b = _c.sent(), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                    return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
            }
        });
    });
}
exports.createUserController = createUserController;
////
//// login user
exports.SendVerifyCodeSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string(),
    hash: zod_1.z.string(),
});
function sendVerifyCodeController(_a) {
    var ctx = _a.ctx, input = _a.input;
    return __awaiter(this, void 0, void 0, function () {
        var prisma, findUser, generatedCode, text, body, tokenCodeStatus, updateUser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prisma = ctx.prisma;
                    if (!input.phoneNumber) {
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: "phonenumber is invalid",
                        });
                    }
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: {
                                phoneNumber: input.phoneNumber,
                            },
                        })];
                case 1:
                    findUser = _b.sent();
                    if (!findUser) {
                        return [2 /*return*/, { status: "ok", isNewUser: true }];
                    }
                    generatedCode = Math.random().toString().substring(2, 8);
                    text = "Code: ".concat(generatedCode, " \n  \u06A9\u062F \u0648\u0631\u0648\u062F \u0634\u0645\u0627 \u0628\u0647 \u0632\u06CC\u067E \u0648\u06CC\n \n ").concat(input.hash);
                    body = {
                        from: "50004001338886",
                        to: input.phoneNumber,
                        text: text,
                    };
                    return [4 /*yield*/, (0, sms_controller_1.sendSMSCodeController)({
                            body: body,
                        })];
                case 2:
                    tokenCodeStatus = (_b.sent()).status;
                    if (tokenCodeStatus !== "ارسال موفق بود") {
                        throw new server_1.TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "مشکل در ارسال کد تایید",
                        });
                    }
                    return [4 /*yield*/, prisma.user.update({
                            where: {
                                phoneNumber: input.phoneNumber,
                            },
                            data: {
                                loginCode: generatedCode,
                            },
                        })];
                case 3:
                    updateUser = _b.sent();
                    if (!updateUser)
                        throw new server_1.TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            cause: "creating login code",
                        });
                    return [2 /*return*/, { status: "ok", isNewUser: false }];
            }
        });
    });
}
exports.sendVerifyCodeController = sendVerifyCodeController;
////
//// verify login code
exports.VerifyLoginCodeSchema = zod_1.z.object({
    code: zod_1.z.string().length(6),
    phoneNumber: zod_1.z.string().max(13),
});
function verifyLoginCodeController(_a) {
    var ctx = _a.ctx, input = _a.input;
    return __awaiter(this, void 0, void 0, function () {
        var code, phoneNumber, findUser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    code = input.code, phoneNumber = input.phoneNumber;
                    return [4 /*yield*/, ctx.prisma.user.findUnique({
                            where: {
                                phoneNumber: phoneNumber,
                            },
                        })];
                case 1:
                    findUser = _b.sent();
                    if ((findUser === null || findUser === void 0 ? void 0 : findUser.loginCode) != code) {
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: "inputs are not valid",
                            cause: "phonenumber or code is invalid",
                        });
                    }
                    return [2 /*return*/, (0, signJWT_1.signJWT)({ res: ctx.res, user: findUser }).then(function (_a) {
                            var accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                            return { accessToken: accessToken, refreshToken: refreshToken };
                        })];
            }
        });
    });
}
exports.verifyLoginCodeController = verifyLoginCodeController;
////
//// users list
function users(_a) {
    var ctx = _a.ctx;
    return __awaiter(this, void 0, void 0, function () {
        var prisma, users;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prisma = ctx.prisma;
                    return [4 /*yield*/, prisma.user.findMany()];
                case 1:
                    users = _b.sent();
                    return [2 /*return*/, users];
            }
        });
    });
}
exports.users = users;
//# sourceMappingURL=user.controller.js.map