import {
  createUserController,
  createUserSchema,
  logoutController,
  LogoutPayloadSchema,
  sendVerifyCodeController,
  SendVerifyCodeSchema,
  users,
  verifyLoginCodeController,
  VerifyLoginCodeSchema,
} from "../controllers/user.controller";
import { router, publicProcedure, userProtectedProcedure } from "../trpc";

export const userRouter = router({
  createUser: publicProcedure
    .input(createUserSchema)
    .mutation(createUserController),
  sendVerifyCode: publicProcedure
    .input(SendVerifyCodeSchema)
    .mutation(sendVerifyCodeController),
  verifyLoginCode: publicProcedure
    .input(VerifyLoginCodeSchema)
    .mutation(verifyLoginCodeController),
  users: userProtectedProcedure.query(users),
  logout: userProtectedProcedure.output(LogoutPayloadSchema).mutation(logoutController),
});
