import { router } from "../trpc";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter, // put procedures under "user" namespace
});

export type AppRouter = typeof appRouter;
