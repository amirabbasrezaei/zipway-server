"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var user_controller_1 = require("../controllers/user.controller");
var trpc_1 = require("../trpc");
exports.userRouter = (0, trpc_1.router)({
    createUser: trpc_1.publicProcedure
        .input(user_controller_1.createUserSchema)
        .mutation(user_controller_1.createUserController),
    sendVerifyCode: trpc_1.publicProcedure
        .input(user_controller_1.SendVerifyCodeSchema)
        .mutation(user_controller_1.sendVerifyCodeController),
    verifyLoginCode: trpc_1.publicProcedure
        .input(user_controller_1.VerifyLoginCodeSchema)
        .mutation(user_controller_1.verifyLoginCodeController),
    users: trpc_1.userProtectedProcedure.query(user_controller_1.users),
});
//# sourceMappingURL=user.router.js.map