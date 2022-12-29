import { zipwayConfigController, zipwayConfigSchema } from "../controllers/app.controller";
import { router, userProtectedProcedure } from "../trpc";

export const appRouter = router({
 zipwayConfig: userProtectedProcedure.input(zipwayConfigSchema).query(zipwayConfigController)
})