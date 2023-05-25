import { initTRPC } from "@trpc/server";
import { isUserAuthed } from "./middlewares/isUserAuthed.middleware";
import superjson from "superjson";

import { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
export const userProtectedProcedure = t.procedure.use(isUserAuthed);
export const mergeRouters = t.mergeRouters;
