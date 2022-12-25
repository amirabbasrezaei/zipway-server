import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import * as trpcExpress from "@trpc/server/adapters/express";

export const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create({
    transformer: SuperJSON,
    errorFormatter({ shape }) {
      return shape;
    },
  });
 
 
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters