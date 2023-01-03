"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var trpc_1 = require("../trpc");
var app_router_1 = require("./app.router");
var user_router_1 = require("./user.router");
exports.appRouter = (0, trpc_1.router)({
    user: user_router_1.userRouter,
    app: app_router_1.zipwayAppRouter
});
//# sourceMappingURL=_app.js.map