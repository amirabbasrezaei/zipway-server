"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipwayAppRouter = void 0;
var app_controller_1 = require("../controllers/app.controller");
var trpc_1 = require("../trpc");
exports.zipwayAppRouter = (0, trpc_1.router)({
    zipwayConfig: trpc_1.userProtectedProcedure.query(app_controller_1.zipwayConfigController),
    coordinateToAddress: trpc_1.userProtectedProcedure
        .input(app_controller_1.coordinateToAddressSchema)
        .mutation(app_controller_1.coordinateToAddressController),
    placeBaseSearch: trpc_1.userProtectedProcedure
        .input(app_controller_1.placeBaseSearchSchema)
        .mutation(app_controller_1.placeBaseSearchController),
});
//# sourceMappingURL=app.router.js.map