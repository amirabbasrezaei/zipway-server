import { router } from "../trpc";
import { userRouter } from "./user";
import { postRouter } from "./post";

export const appRouter = router({
  userRouter, // put procedures under "user" namespace
  postRouter, // put procedures under "post" namespace
});

export type AppRouter = typeof appRouter;
