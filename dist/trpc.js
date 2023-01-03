"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRouters = exports.userProtectedProcedure = exports.publicProcedure = exports.router = exports.middleware = exports.t = void 0;
var server_1 = require("@trpc/server");
var isUserAuthed_middleware_1 = require("./middlewares/isUserAuthed.middleware");
exports.t = server_1.initTRPC.context().create({
    // transformer: SuperJSON,
    errorFormatter: function (_a) {
        var shape = _a.shape;
        return shape;
    },
});
exports.middleware = exports.t.middleware;
exports.router = exports.t.router;
exports.publicProcedure = exports.t.procedure;
exports.userProtectedProcedure = exports.t.procedure.use(isUserAuthed_middleware_1.isUserAuthed);
exports.mergeRouters = exports.t.mergeRouters;
//# sourceMappingURL=trpc.js.map