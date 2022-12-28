import * as dotenv from "dotenv";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./context";
import { appRouter } from "./routers/_app";
import cookieparser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({ credentials: false, origin: "*" }));
app.use(cookieparser());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(5000, () => {
  console.log("app is running");
});
