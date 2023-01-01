import { router } from "../trpc";
import { zipwayAppRouter } from "./app.router";
import { userRouter } from "./user.router";

export const appRouter = router({
  user: userRouter, // put procedures under "user" namespace
  app: zipwayAppRouter
});

export type AppRouter = typeof appRouter;
