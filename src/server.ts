import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./trpc";
import { appRouter } from "./routers/_app";

const app = express();
// app.use((req, _, next) => {
//   console.log("req", req.headers);
//   next();
// });
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(5000, () => {
  console.log("app is running");
})
