import { getUsersController } from "../controllers/panel.controller";
import { router, userProtectedProcedure } from "../trpc";
import {z} from 'zod'
export const panelRouter = router({
  getusers: userProtectedProcedure.input(z.any()).query(getUsersController)
});
